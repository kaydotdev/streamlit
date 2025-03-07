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
import { getLogger } from "loglevel"

import { isNullOrUndefined } from "~lib/util/utils"
import { StreamlitEndpoints } from "~lib/StreamlitEndpoints"

import { ComponentMessageType } from "./enums"

export type ComponentMessageListener = (
  type: ComponentMessageType,
  data: any
) => void

const LOG = getLogger("ComponentRegistry")

/**
 * Dispatches iframe messages to ComponentInstances.
 */
export class ComponentRegistry {
  private readonly endpoints: StreamlitEndpoints

  private readonly msgListeners = new Map<
    MessageEventSource,
    ComponentMessageListener
  >()

  public constructor(endpoints: StreamlitEndpoints) {
    this.endpoints = endpoints
    window.addEventListener("message", this.onMessageEvent)
  }

  /**
   * Register a listener for component messages dispatched by the given source.
   */
  public registerListener = (
    source: MessageEventSource,
    listener: ComponentMessageListener
  ): void => {
    if (this.msgListeners.has(source)) {
      LOG.warn(`MessageEventSource registered multiple times!`, source)
    }

    this.msgListeners.set(source, listener)
  }

  public deregisterListener = (source: MessageEventSource): void => {
    const removed = this.msgListeners.delete(source)
    if (!removed) {
      LOG.warn(`Could not deregister unregistered MessageEventSource!`)
    }
  }

  /** Return a URL for fetching a resource for the given component. */
  public getComponentURL = (componentName: string, path: string): string => {
    return this.endpoints.buildComponentURL(componentName, path)
  }

  private onMessageEvent = (event: MessageEvent): void => {
    if (
      isNullOrUndefined(event.data) ||
      !event.data.hasOwnProperty("isStreamlitMessage")
    ) {
      // Disregard messages that don't come from components.
      return
    }

    if (isNullOrUndefined(event.source)) {
      // This should not be possible.
      LOG.warn(`Received component message with no eventSource!`, event.data)
      return
    }

    // Get the ComponentInstance associated with the event
    const listener = this.msgListeners.get(event.source)
    if (isNullOrUndefined(listener) || typeof listener !== "function") {
      LOG.warn(
        `Received component message for unregistered ComponentInstance!`,
        event.data
      )
      return
    }

    const { type } = event.data
    if (isNullOrUndefined(type)) {
      LOG.warn(`Received Streamlit message with no type!`, event.data)
      return
    }

    // Forward the message on to the appropriate ComponentInstance.
    listener(type, event.data)
  }
}
