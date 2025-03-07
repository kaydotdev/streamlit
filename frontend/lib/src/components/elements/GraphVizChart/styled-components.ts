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

import styled from "@emotion/styled"

interface StyledGraphVizChartProps {
  isFullScreen: boolean
  useContainerWidth: boolean
}

export const StyledGraphVizChart = styled.div<StyledGraphVizChartProps>(
  ({ theme, isFullScreen, useContainerWidth }) => ({
    "& *": {
      fontFamily: theme.genericFonts.bodyFont,
      // Font sizes inside the SVG element are getting huge for some reason.
      // Hacking together a number by eyeballing it:
      // 12px in the SVG looks like 1rem outside.
      fontSize: `calc(${theme.fontSizes.twoSm} * 0.8)`,
    },

    // Ensure SVG is allowed the full width/height in full screen mode
    "& svg": {
      maxWidth: "100%",
      width: isFullScreen || useContainerWidth ? "100%" : "auto",
      height: isFullScreen ? "100%" : "auto",
      borderRadius: theme.radii.default,
    },
    width: isFullScreen ? "100%" : "auto",
    height: isFullScreen ? "100%" : "auto",
  })
)
