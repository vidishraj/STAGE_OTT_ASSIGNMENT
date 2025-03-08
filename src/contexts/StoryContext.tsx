import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import UserInfo from "../assets/userStories.json";

// Types
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
  | { type: "UPDATE_COUNTS"; user: string };

// Reducer
const storyReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "MARK_STORY_VIEWED":
      return {
        ...state,
        users: state.users.map((userStory) =>
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
        ),
      };

    case "MARK_USER_VIEWED":
      return {
        ...state,
        users: state.users.map((userStory) =>
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
        ),
      };

    case "UPDATE_COUNTS":
      return {
        ...state,
        users: state.users.map((userStory) =>
          userStory.user === action.user
            ? {
                ...userStory,
                viewCount: userStory.stories.filter((story) => story.viewed)
                  .length,
                storyCount: userStory.stories.length,
              }
            : userStory,
        ),
      };

    default:
      return state;
  }
};

// Context
const StoryContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Provider
export const StoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state with processed UserInfo
  const initialState: State = useMemo(() => {
    const formattedUsers = UserInfo.map((user: any) => ({
      ...user,
      storyCount: user.stories.length,
      viewCount: 0,
    }));
    return { users: formattedUsers };
  }, []);

  const [state, dispatch] = useReducer(storyReducer, initialState);

  return (
    <StoryContext.Provider value={{ state, dispatch }}>
      {children}
    </StoryContext.Provider>
  );
};

// Hook to use the context
export const useStoryContext = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStoryContext must be used within a StoryProvider");
  }
  return context;
};
