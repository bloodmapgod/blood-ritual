/* global Vue */

Vue.component('trivia-circle', {
  props: ['trivia'],
  data: function () {
    return {
      clockInterval: null,
      interactive: false,
      correctlyAnsweredCount: 0,
      answered: false,
      questionNum: 0,
      questions: [],
      secondsRemaining: 60
    };
  },
  computed: {
    questionCount: function () {
      return this.questions.length;
    },
    isLast: function () {
      return this.questionCount && this.questionCount === this.questionNum;
    },
    answerKeys: function () {
      return ['A', 'C', 'B', 'D'];
    },
    hasQuestions: function () {
      return this.questions.length > 0;
    },
    question: function () {
      return this.questions[this.questionNum - 1];
    }
  },
  created: function() {
    getRandomQuestions(3, (questions) => {
      this.questions = questions.map(q => ({
        category: q.category,
        question: q.question,
        answers: _.shuffle(q['incorrect_answers'].concat([q['correct_answer']])),
        correctAnswer: q['correct_answer']
      }));
      this.next();
    });
  },
  beforeDestroy: function () {
    this.stopAllTracks();
    clearInterval(this.clockInterval);
  },
  template: `
    <div id="trivia-circle">
      <div v-if="hasQuestions">
        <img src="img/monkahmm.png" alt="">
        <h2>{{ secondsRemaining }}</h2>
        <h3 v-html="question.category"></h3>
        <h2>
          <span>{{ questionNum }}/{{ questionCount }})</span>
          <span v-html="question.question"></span>
        </h2>
        <ul id="trivia-answers">
          <li v-for="(a, idx) in question.answers">
            <span>{{ answerKeys[idx] }})</span>
            <span v-html="a" v-on:click="submitAnswer(a)" v-bind:class="{ correct: answered && isCorrect(a), incorrect: answered && !isCorrect(a) }"></span>
          </li>
        </ul>
        <button v-if="answered" class="btn-continue" v-on:click="next">Continue</button>
      </div>
      <div v-else class="flex-center w100 h100">
        <img src="img/red_loader.gif" alt="">
      </div>
    </div>
  `,
  methods: {
    isCorrect: function(answer) {
      return answer === this.question.correctAnswer;
    },
    restartClock: function () {
      clearInterval(this.clockInterval);
      this.secondsRemaining = 60;
      this.clockInterval = setInterval(() => {
        this.secondsRemaining--;
        if (this.secondsRemaining <= 0) {
          this.stopAllTracks();
          this.triggerCompleted();
        }
      }, 1000);
    },
    pauseClock: function () {
      clearInterval(this.clockInterval);
    },
    stopAllTracks: function () {
      audioHelper.tracks.triviaBg.stop();
      audioHelper.tracks.triviaCorrect.stop();
      audioHelper.tracks.triviaIncorrect.stop();
      audioHelper.tracks.triviaBg.stop();
      audioHelper.tracks.triviaIntro.stop();
    },
    triggerCompleted: function () {
      this.$emit('completed', this.correctlyAnsweredCount / this.questionCount);
    },
    next: function () {
      this.stopAllTracks();

      if (this.isLast) {
        this.triggerCompleted();
        return;
      }

      audioHelper.tracks.triviaBg.replay();
      audioHelper.tracks.triviaIntro.replay();
      this.restartClock();
      this.questionNum++;
      this.answersInteractive = true;
      this.answered = false;
    },
    submitAnswer: function (selectedAnswer) {
      if (!this.answersInteractive) {
        return;
      }
      this.answersInteractive = false;

      audioHelper.tracks.triviaCorrect.stop();
      audioHelper.tracks.triviaIncorrect.stop();
      audioHelper.tracks.triviaBg.stop();
      audioHelper.tracks.triviaIntro.stop();

      this.pauseClock();

      if (this.isCorrect(selectedAnswer)) {
        this.correctlyAnsweredCount++;
        audioHelper.tracks.triviaCorrect.replay();
      } else {
        audioHelper.tracks.triviaIncorrect.replay();
      }
      this.answered = true;
    }
  }
});
