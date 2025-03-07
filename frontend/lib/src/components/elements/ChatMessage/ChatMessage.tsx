/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { memo, ReactElement } from "react"

import { useTheme } from "@emotion/react"
import { Face, SmartToy } from "@emotion-icons/material-outlined"

import { Block as BlockProto } from "@streamlit/protobuf"

import Icon, { DynamicIcon } from "~lib/components/shared/Icon"
import { EmotionTheme } from "~lib/theme"
import { StreamlitEndpoints } from "~lib/StreamlitEndpoints"

import {
  StyledAvatarBackground,
  StyledAvatarIcon,
  StyledAvatarImage,
  StyledChatMessageContainer,
  StyledMessageContent,
} from "./styled-components"

interface ChatMessageAvatarProps {
  name: string
  avatar?: string
  avatarType?: BlockProto.ChatMessage.AvatarType
  endpoints: StreamlitEndpoints
}

function ChatMessageAvatar(
  props: Readonly<ChatMessageAvatarProps>
): ReactElement {
  const { avatar, avatarType, name, endpoints } = props
  const theme: EmotionTheme = useTheme()

  if (avatar) {
    switch (avatarType) {
      case BlockProto.ChatMessage.AvatarType.IMAGE:
        return (
          <StyledAvatarImage
            src={endpoints.buildMediaURL(avatar)}
            alt={`${name} avatar`}
          />
        )
      case BlockProto.ChatMessage.AvatarType.EMOJI:
        return <StyledAvatarBackground>{avatar}</StyledAvatarBackground>
      case BlockProto.ChatMessage.AvatarType.ICON:
        if (avatar === "user") {
          return (
            <StyledAvatarIcon
              data-testid="stChatMessageAvatarUser"
              background={theme.colors.red60}
            >
              <Icon content={Face} size="lg" />
            </StyledAvatarIcon>
          )
        } else if (avatar === "assistant") {
          return (
            <StyledAvatarIcon
              data-testid="stChatMessageAvatarAssistant"
              background={theme.colors.orange60}
            >
              <Icon content={SmartToy} size="lg" />
            </StyledAvatarIcon>
          )
        } else if (avatar.startsWith(":material")) {
          return (
            <StyledAvatarBackground data-testid="stChatMessageAvatarCustom">
              <DynamicIcon
                size="lg"
                iconValue={avatar}
                color={theme.colors.bodyText}
              />
            </StyledAvatarBackground>
          )
        }
    }
  }

  // Fallback to first character of the name label if nothing else can be matched:
  return (
    <StyledAvatarBackground>
      {name ? name.charAt(0).toUpperCase() : "🧑‍💻"}
    </StyledAvatarBackground>
  )
}

export interface ChatMessageProps {
  endpoints: StreamlitEndpoints
  element: BlockProto.ChatMessage
}

const ChatMessage: React.FC<React.PropsWithChildren<ChatMessageProps>> = ({
  endpoints,
  element,
  children,
}): ReactElement => {
  const { avatar, avatarType, name } = element

  return (
    <StyledChatMessageContainer
      className="stChatMessage"
      data-testid="stChatMessage"
      background={["user", "human"].includes(name.toLowerCase())}
    >
      <ChatMessageAvatar
        name={name}
        avatar={avatar}
        avatarType={avatarType}
        endpoints={endpoints}
      />
      <StyledMessageContent
        data-testid="stChatMessageContent"
        aria-label={`Chat message from ${name}`}
      >
        {children}
      </StyledMessageContent>
    </StyledChatMessageContainer>
  )
}

export default memo(ChatMessage)
