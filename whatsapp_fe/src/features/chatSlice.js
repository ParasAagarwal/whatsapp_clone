import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CONVERSATION_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/conversation`;
const MESSAGE_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/message`;

const initialState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  messages: [],
  notifications: [],
};

//functions
export const getConversations = createAsyncThunk(
  "conversation/all",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const open_create_conversation = createAsyncThunk(
  "conversation/open_create",
  async (values, { rejectWithValue }) => {
    const { token, receiver_id } = values;
    try {
      const { data } = await axios.post(
        CONVERSATION_ENDPOINT,
        { receiver_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const getConversationMessages = createAsyncThunk(
  "conervsation/messages",
  async (values, { rejectWithValue }) => {
    const { token, convo_id } = values;
    try {
      const { data } = await axios.get(`${MESSAGE_ENDPOINT}/${convo_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
//updating message to backend when we send
export const sendMessage = createAsyncThunk(
  "message/send",
  async (values, { rejectWithValue }) => {
    const { token, message, convo_id, files } = values;
    try {
      const { data } = await axios.post(
        MESSAGE_ENDPOINT,
        {
          message,
          convo_id,
          files,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConversations.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload; //this is data that is returned and set to the state now
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; //this is error that is returned from rejectWithValue and set to the state now
      })
      .addCase(open_create_conversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(open_create_conversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeConversation = action.payload; //now adding that to active conversation so that we can read chats after clicking the chat
        state.files = [];
      })
      .addCase(open_create_conversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getConversationMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = [...state.messages, action.payload];//we are returning message from backend hence we are adding it here in the state
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setActiveConversation } = chatSlice.actions;
export default chatSlice.reducer;
