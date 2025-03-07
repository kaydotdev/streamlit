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

import { mockEndpoints } from "~lib/mocks/mocks"

import { handleFavicon } from "./Favicon"

function getFaviconHref(): string {
  const faviconElement: HTMLLinkElement | null = document.querySelector(
    "link[rel='shortcut icon']"
  )
  return faviconElement ? faviconElement.href : ""
}

document.head.innerHTML = `<link rel="shortcut icon" href="default.png">`

const FLAG_MATERIAL_ICON_URL =
  "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/flag/default/24px.svg"

const SMART_DISPLAY_MATERIAL_ICON_URL =
  "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/smart_display/default/24px.svg"

const ACCESSIBILITY_NEW_MATERIAL_ICON_URL =
  "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/accessibility_new/default/24px.svg"

test("is set up with the default favicon", () => {
  expect(getFaviconHref()).toBe("http://localhost:3000/default.png")
})

describe("Favicon element", () => {
  const buildMediaURL = vi.fn().mockReturnValue("https://mock.media.url")
  const endpoints = mockEndpoints({ buildMediaURL: buildMediaURL })

  it("sets the favicon in the DOM", () => {
    handleFavicon("https://some/random/favicon.png", vi.fn(), endpoints)
    expect(buildMediaURL).toHaveBeenCalledWith(
      "https://some/random/favicon.png"
    )
    expect(getFaviconHref()).toBe("https://mock.media.url/")
  })

  it("accepts emojis directly", () => {
    handleFavicon("🍕", vi.fn(), endpoints)
    // Check that its an svg that contains the pizza emoji bytecode:
    expect(getFaviconHref()).toContain("svg")
    expect(getFaviconHref()).toContain("%F0%9F%8D%95")
  })

  it("handles emoji variants correctly", () => {
    handleFavicon("🛰", vi.fn(), endpoints)
    // Check that its an svg that contains the satellite emoji bytecode:
    expect(getFaviconHref()).toContain("svg")
    expect(getFaviconHref()).toContain("%F0%9F%9B%B0")
  })

  it("handles material icon correctly", () => {
    handleFavicon(":material/flag:", vi.fn(), endpoints)
    expect(getFaviconHref()).toBe(FLAG_MATERIAL_ICON_URL)

    handleFavicon(":material/smart_display:", vi.fn(), endpoints)
    expect(getFaviconHref()).toBe(SMART_DISPLAY_MATERIAL_ICON_URL)

    handleFavicon(":material/accessibility_new:", vi.fn(), endpoints)
    expect(getFaviconHref()).toBe(ACCESSIBILITY_NEW_MATERIAL_ICON_URL)
  })

  it("handles emoji shortcodes containing a dash correctly", () => {
    handleFavicon(":crescent-moon:", vi.fn(), endpoints)
    // Check that its an svg that contains the crescent moon emoji bytecode:
    expect(getFaviconHref()).toContain("svg")
    expect(getFaviconHref()).toContain("%F0%9F%8C%99")
  })

  it("accepts emoji shortcodes", () => {
    handleFavicon(":pizza:", vi.fn(), endpoints)
    // Check that its an svg that contains the pizza emoji bytecode:
    expect(getFaviconHref()).toContain("svg")
    expect(getFaviconHref()).toContain("%F0%9F%8D%95")
  })

  it("updates the favicon when it changes", () => {
    handleFavicon("/media/1234567890.png", vi.fn(), endpoints)
    handleFavicon(":pizza:", vi.fn(), endpoints)
    // Check that its an svg that contains the pizza emoji bytecode:
    expect(getFaviconHref()).toContain("svg")
    expect(getFaviconHref()).toContain("%F0%9F%8D%95")
  })

  it("sends SET_PAGE_FAVICON message to host", () => {
    const sendMessageToHost = vi.fn()
    handleFavicon(
      "https://streamlit.io/path/to/favicon.png",
      sendMessageToHost,
      endpoints
    )
    expect(sendMessageToHost).toHaveBeenCalledWith({
      favicon: "https://mock.media.url",
      type: "SET_PAGE_FAVICON",
    })
  })
})
