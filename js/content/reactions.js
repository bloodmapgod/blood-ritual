//
// - reactions.generic.positive: image to show on success bear/bull rituals
// - reactions.generic.negative: image to show on failed bear/bull rituals
// - reactions.bear.positive: image to show on success bear rituals
// - reactions.bear.negative: image to show on failed bear rituals
// - reactions.bull.positive: image to show on success bull rituals
// - reactions.bull.negative: image to show on failed bull rituals

let reactions = {
  generic: {
    positive: [
      "https://thumbs.gfycat.com/GoodShadyGalapagosalbatross-mobile.mp4", // pogchamp
      "https://thumbs.gfycat.com/FaithfulSneakyGoshawk-mobile.mp4", // pogchamp
      "https://thumbs.gfycat.com/ShyImmaculateDragon-mobile.mp4", // cramer love
      "https://thumbs.gfycat.com/AccurateBelatedBats-mobile.mp4", // dance tv
      "https://thumbs.gfycat.com/AngryQuestionableIbex-mobile.mp4", // tyrone dance
      "https://thumbs.gfycat.com/BiodegradableIllegalChrysalis-mobile.mp4", // celebrate jonah hill
      "https://thumbs.gfycat.com/GivingNewDiscus-mobile.mp4", // celebrate himym
      "https://thumbs.gfycat.com/ColossalHotCavy-mobile.mp4", // celebrate seinfeld
      "https://thumbs.gfycat.com/WiltedSplendidBoutu-mobile.mp4", // celebrate tom hanks
      "https://thumbs.gfycat.com/TameColorlessBigmouthbass-mobile.mp4", // celebrate snoop dogg
      "https://thumbs.gfycat.com/LikableFrightenedBrahmancow-mobile.mp4", // dance srubs
      "https://thumbs.gfycat.com/WhichReadyGreendarnerdragonfly-mobile.mp4", // dance carlton
    ],
    negative: [
      "https://thumbs.gfycat.com/HappyWindingGoldeneye-mobile.mp4", // kekw
      "https://thumbs.gfycat.com/PinkPastelIlsamochadegu-mobile.mp4", // kevin hart sad
      "https://thumbs.gfycat.com/OddLightheartedKiskadee-mobile.mp4", // kid cry
      "https://thumbs.gfycat.com/MatureFlickeringGypsymoth-mobile.mp4", // kramer shame
    ],
  },
  bear: {
    positive: [
      "https://thumbs.gfycat.com/AntiqueSolidFreshwatereel-mobile.mp4", // timber
      "https://thumbs.gfycat.com/OrdinaryRectangularAyeaye-mobile.mp4", // stonks down run
      "https://thumbs.gfycat.com/FairWelloffArthropods-mobile.mp4", // bear friend
      "https://thumbs.gfycat.com/GrippingWarmHagfish-mobile.mp4", // bear mushroom
      "https://thumbs.gfycat.com/WanNecessaryBoubou-mobile.mp4", // bear wave
      "https://thumbs.gfycat.com/SmugMistyIbisbill-mobile.mp4", // bear wave 2
      "https://thumbs.gfycat.com/DearestElasticLarva-mobile.mp4", // bear back scratch
      "https://thumbs.gfycat.com/DeficientPleasedDoe-mobile.mp4", // bear dance
      "https://media2.giphy.com/media/l0HlDDyxBfSaPpU88/giphy.gif", // sp sell
      "https://thumbs.gfycat.com/BountifulFreeLaughingthrush-max-1mb.gif", // panda take gains
      "https://media.tenor.com/videos/52b68d62a87d7104b62f6b8902fd2758/mp4", // bear dance
      "https://media.tenor.com/videos/0e69563bd657f5cbc0ba9a747724e37b/mp4", // bear guitar
      "https://media.tenor.com/videos/0297ff556b70bccd25f2618c2bdf5554/mp4", // bear kung fu
    ],
    negative: [
      "https://thumbs.gfycat.com/FriendlyUnacceptableKingbird-mobile.mp4", // bear skunk
      "https://thumbs.gfycat.com/HappyWholeAsianpiedstarling-mobile.mp4", // bear mad
      "https://thumbs.gfycat.com/HarmlessLittleFrog-mobile.mp4", // polar bear tired
      "https://thumbs.gfycat.com/BiodegradableLiquidFlicker-mobile.mp4", // panda mad
      "https://thumbs.gfycat.com/CleanUnacceptableElephantbeetle-mobile.mp4", // panda cry
      "https://thumbs.gfycat.com/ForthrightEcstaticElephantbeetle-mobile.mp4", // panda steal baby
      "https://thumbs.gfycat.com/AnyClumsyBullfrog-mobile.mp4", // panda lose bucket
    ],
  },
  bull: {
    positive: [
      "https://thumbs.gfycat.com/BestSparklingBluebottlejellyfish-mobile.mp4", // rocket
      "https://thumbs.gfycat.com/LegitimateObviousDuckling-mobile.mp4", // rocket
      "https://media1.tenor.com/images/510df6a05c4e51a8a0efed7dd54a0ff5/tenor.gif", // bull scare jump
      "https://media1.giphy.com/media/ql0E9jsmyb9GE/giphy.gif", // bull pamplona scare
    ],
    negative: [
      "https://thumbs.gfycat.com/ConventionalWhoppingEmperorpenguin-mobile.mp4", // bear attack
      "https://thumbs.gfycat.com/GraySnivelingDamselfly-mobile.mp4", // bull jump over
      "https://media2.giphy.com/media/l0HlDDyxBfSaPpU88/giphy.gif", // sp sell
    ],
  },
};

function getStockReaction(bear, positive) {
  let buckets = [reactions.generic];
  buckets.push(bear ? reactions.bear : reactions.bull);

  let items = positive ? buckets[0].positive.concat(buckets[1].positive)
                       : buckets[0].negative.concat(buckets[1].negative);

  return _.sample(items);
}
