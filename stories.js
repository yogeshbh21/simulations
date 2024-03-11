const STORY_TYPES = {
  STORY_1: "STORY_1",
  STORY_2: "STORY_2",
};

const storyTypeToStoryMap = {
  [STORY_TYPES.STORY_1]: "story1",
  [STORY_TYPES.STORY_2]: "story2",
};

const getStoryByType = (type) => {
  return storyTypeToStoryMap[type];
};
