const STORY_TYPES = {
  STORY_1: "STORY_1",
};

const storyTypeToStoryMap = {
  [STORY_TYPES.STORY_1]: "story1",
};

const getStoryByType = (type) => {
  return storyTypeToStoryMap[type];
};
