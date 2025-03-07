# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from playwright.sync_api import Page, expect

from e2e_playwright.conftest import wait_for_app_run


def test_no_concurrent_changes(app: Page):
    counters = app.get_by_test_id("stMarkdown")
    expect(counters.first).to_have_text("0", use_inner_text=True)

    button = app.get_by_test_id("stButton")
    button.first.click()
    wait_for_app_run(app)

    counters = app.get_by_test_id("stMarkdown")
    expect(counters.nth(0)).to_have_text(
        counters.nth(1).inner_text(), use_inner_text=True
    )
