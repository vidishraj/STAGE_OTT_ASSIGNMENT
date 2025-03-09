import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import UserInfo from "../assets/userStories.json";

interface Story {
  url: string;
  viewed: boolean;
}

interface UserStory {
  user: string;
  profilePicture: string;
  viewCount: number;
  storyCount: number;
  stories: Story[];
}

interface State {
  users: UserStory[];
}

type Action =
  | { type: "MARK_STORY_VIEWED"; user: string; storyUrl: string }
  | { type: "MARK_USER_VIEWED"; user: string }
  | { type: "UPDATE_COUNTS"; user: string }
  | { type: "SORT_USERS" };

const sortUsersByViewedStatus = (users: UserStory[]): UserStory[] => {
  return [...users].sort((a, b) => {
    const aAllViewed = a.viewCount === a.storyCount;
    const bAllViewed = b.viewCount === b.storyCount;

    if (aAllViewed && !bAllViewed) {
      return 1;
    }

    if (bAllViewed && !aAllViewed) {
      return -1;
    }

    return 0;
  });
};

const storyReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "MARK_STORY_VIEWED": {
      const updatedUsers = state.users.map((userStory) =>
        userStory.user === action.user
          ? {
              ...userStory,
              viewCount: userStory.viewCount + 1,
              stories: userStory.stories.map((story) =>
                story.url === action.storyUrl
                  ? { ...story, viewed: true }
                  : story,
              ),
            }
          : userStory,
      );

      return {
        ...state,
        users: updatedUsers,
      };
    }

    case "MARK_USER_VIEWED": {
      const updatedUsers = state.users.map((userStory) =>
        userStory.user === action.user
          ? {
              ...userStory,
              viewCount: userStory.storyCount,
              stories: userStory.stories.map((story) => ({
                ...story,
                viewed: true,
              })),
            }
          : userStory,
      );

      const sortedUsers = sortUsersByViewedStatus(updatedUsers);

      return {
        ...state,
        users: sortedUsers,
      };
    }

    case "UPDATE_COUNTS": {
      const updatedUsers = state.users.map((userStory) =>
        userStory.user === action.user
          ? {
              ...userStory,
              viewCount: userStory.stories.filter((story) => story.viewed)
                .length,
              storyCount: userStory.stories.length,
            }
          : userStory,
      );

      return {
        ...state,
        users: updatedUsers,
      };
    }

    case "SORT_USERS": {
      const sortedUsers = sortUsersByViewedStatus(state.users);

      return {
        ...state,
        users: sortedUsers,
      };
    }

    default:
      return state;
  }
};

const StoryContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  getUserByIndex: (index: number) => UserStory | null;
  getStoryByIndex: (userIndex: number, storyIndex: number) => Story | null;
} | null>(null);

export const StoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialState: State = useMemo(() => {
    const formattedUsers = UserInfo.map((user: any) => ({
      ...user,
      storyCount: user.stories.length,
      viewCount: 0,
    }));
    return { users: formattedUsers };
  }, []);

  const [state, dispatch] = useReducer(storyReducer, initialState);

  const getUserByIndex = (index: number): UserStory | null => {
    if (index < 0 || index >= state.users.length) {
      return null;
    }
    return state.users[index];
  };

  const getStoryByIndex = (
    userIndex: number,
    storyIndex: number,
  ): Story | null => {
    const user = getUserByIndex(userIndex);
    if (!user || storyIndex < 0 || storyIndex >= user.stories.length) {
      return null;
    }
    return user.stories[storyIndex];
  };

  useEffect(() => {
    dispatch({ type: "SORT_USERS" });
  }, []);

  const contextValue = {
    state,
    dispatch,
    getUserByIndex,
    getStoryByIndex,
  };

  return (
    <StoryContext.Provider value={contextValue}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStoryContext = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStoryContext must be used within a StoryProvider");
  }
  return context;
};
