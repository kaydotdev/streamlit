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

import React from "react"

import { ChevronLeft, ChevronRight } from "@emotion-icons/material-outlined"

import BaseButton, { BaseButtonKind } from "~lib/components/shared/BaseButton"
import Icon from "~lib/components/shared/Icon"
import { Small } from "~lib/components/shared/TextElements"

import { StyledPagination, StyledPaginators } from "./styled-components"

export interface Props {
  currentPage: number
  totalPages: number
  pageSize: number
  onNext: (event: React.SyntheticEvent<HTMLElement>) => void
  onPrevious: (event: React.SyntheticEvent<HTMLElement>) => void
}

const Pagination = ({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
}: Props): React.ReactElement => {
  return (
    <StyledPagination data-testid="stFileUploaderPagination">
      <Small>{`Showing page ${currentPage} of ${totalPages}`}</Small>
      <StyledPaginators>
        <BaseButton onClick={onPrevious} kind={BaseButtonKind.MINIMAL}>
          <Icon content={ChevronLeft} size="xl" />
        </BaseButton>
        <BaseButton onClick={onNext} kind={BaseButtonKind.MINIMAL}>
          <Icon content={ChevronRight} size="xl" />
        </BaseButton>
      </StyledPaginators>
    </StyledPagination>
  )
}

export default Pagination
