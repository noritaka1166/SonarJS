/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2012-2025 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the Sonar Source-Available License Version 1, as published by SonarSource SA.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the Sonar Source-Available License for more details.
 *
 * You should have received a copy of the Sonar Source-Available License
 * along with this program; if not, see https://sonarsource.com/license/ssal/
 */
package com.sonar.javascript.it.plugin;

import static com.sonar.javascript.it.plugin.OrchestratorStarter.newWsClient;
import static java.util.Collections.emptySet;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import com.sonar.orchestrator.Orchestrator;
import com.sonar.orchestrator.build.BuildResult;
import com.sonar.orchestrator.build.SonarScanner;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.sonarqube.ws.Issues.Issue;
import org.sonarqube.ws.client.issues.SearchRequest;

@ExtendWith(OrchestratorStarter.class)
class CssIssuesTest {

  private static final String PROJECT_KEY = "css-issues-project";

  private static final Orchestrator orchestrator = OrchestratorStarter.ORCHESTRATOR;

  private static BuildResult buildResult;

  @BeforeAll
  public static void prepare() {
    ProfileGenerator.RulesConfiguration rulesConfiguration =
      new ProfileGenerator.RulesConfiguration();
    rulesConfiguration.add("S4660", "ignorePseudoElements", "ng-deep, /^custom-/");
    var profile = ProfileGenerator.generateProfile(
      orchestrator,
      "css",
      "css",
      rulesConfiguration,
      emptySet()
    );
    orchestrator.getServer().provisionProject(PROJECT_KEY, PROJECT_KEY);
    orchestrator.getServer().associateProjectToQualityProfile(PROJECT_KEY, "css", profile);

    SonarScanner scanner = CssTestsUtils.createScanner(PROJECT_KEY);
    scanner.setProperty("sonar.exclusions", "**/file-with-parsing-error-excluded.css");
    buildResult = orchestrator.executeBuild(scanner);
  }

  @Test
  void parsing_error_not_on_excluded_files() {
    assertThat(buildResult.getLogs())
      .doesNotMatch(
        "(?s).*WARN: Failed to parse file file:\\S*file-with-parsing-error-excluded\\.css.*"
      )
      .matches(
        "(?s).*WARN: Failed to parse file file:\\S*file-with-parsing-error\\.css, line 1, Unclosed block.*"
      );
  }

  @Test
  void issue_list() {
    SearchRequest request = new SearchRequest();
    request.setComponentKeys(Collections.singletonList(PROJECT_KEY));
    List<Issue> issuesList = newWsClient(orchestrator)
      .issues()
      .search(request)
      .getIssuesList()
      .stream()
      .filter(i -> i.getRule().startsWith("css:"))
      .collect(Collectors.toList());

    assertThat(issuesList)
      .extracting(Issue::getRule, Issue::getComponent)
      .containsExactlyInAnyOrder(
        tuple("css:S4662", "css-issues-project:src/cssModules.css"),
        tuple("css:S4667", "css-issues-project:src/empty1.css"),
        tuple("css:S4667", "css-issues-project:src/empty2.less"),
        tuple("css:S4667", "css-issues-project:src/empty3.scss"),
        tuple("css:S1128", "css-issues-project:src/file1.css"),
        tuple("css:S1116", "css-issues-project:src/file1.css"),
        tuple("css:S4664", "css-issues-project:src/file1.css"),
        tuple("css:S4660", "css-issues-project:src/file1.css"),
        tuple("css:S4659", "css-issues-project:src/file1.css"),
        tuple("css:S4647", "css-issues-project:src/file1.css"),
        tuple("css:S4663", "css-issues-project:src/file1.css"),
        tuple("css:S4652", "css-issues-project:src/file1.css"),
        tuple("css:S4656", "css-issues-project:src/file1.css"),
        tuple("css:S4649", "css-issues-project:src/file1.css"),
        tuple("css:S4648", "css-issues-project:src/file1.css"),
        tuple("css:S4654", "css-issues-project:src/file1.css"),
        tuple("css:S4657", "css-issues-project:src/file1.css"),
        tuple("css:S4650", "css-issues-project:src/file1.css"),
        tuple("css:S4650", "css-issues-project:src/file1.css"),
        tuple("css:S4668", "css-issues-project:src/file1.css"),
        tuple("css:S4654", "css-issues-project:src/file1.css"),
        tuple("css:S4651", "css-issues-project:src/file1.css"),
        tuple("css:S4666", "css-issues-project:src/file1.css"),
        tuple("css:S4670", "css-issues-project:src/file1.css"),
        tuple("css:S4662", "css-issues-project:src/file1.css"),
        tuple("css:S4655", "css-issues-project:src/file1.css"),
        tuple("css:S4658", "css-issues-project:src/file1.css"),
        tuple("css:S4661", "css-issues-project:src/file1.css"),
        tuple("css:S1128", "css-issues-project:src/file2.less"),
        tuple("css:S1116", "css-issues-project:src/file2.less"),
        tuple("css:S4664", "css-issues-project:src/file2.less"),
        tuple("css:S4660", "css-issues-project:src/file2.less"),
        tuple("css:S4659", "css-issues-project:src/file2.less"),
        tuple("css:S4647", "css-issues-project:src/file2.less"),
        tuple("css:S4663", "css-issues-project:src/file2.less"),
        tuple("css:S4652", "css-issues-project:src/file2.less"),
        tuple("css:S4656", "css-issues-project:src/file2.less"),
        tuple("css:S4649", "css-issues-project:src/file2.less"),
        tuple("css:S4648", "css-issues-project:src/file2.less"),
        tuple("css:S4654", "css-issues-project:src/file2.less"),
        tuple("css:S4657", "css-issues-project:src/file2.less"),
        tuple("css:S4650", "css-issues-project:src/file2.less"),
        tuple("css:S4650", "css-issues-project:src/file2.less"),
        tuple("css:S4651", "css-issues-project:src/file2.less"),
        tuple("css:S4666", "css-issues-project:src/file2.less"),
        tuple("css:S4670", "css-issues-project:src/file2.less"),
        tuple("css:S4662", "css-issues-project:src/file2.less"),
        tuple("css:S4655", "css-issues-project:src/file2.less"),
        tuple("css:S4658", "css-issues-project:src/file2.less"),
        tuple("css:S4661", "css-issues-project:src/file2.less"),
        tuple("css:S1128", "css-issues-project:src/file3.scss"),
        tuple("css:S1116", "css-issues-project:src/file3.scss"),
        tuple("css:S4664", "css-issues-project:src/file3.scss"),
        tuple("css:S4660", "css-issues-project:src/file3.scss"),
        tuple("css:S4659", "css-issues-project:src/file3.scss"),
        tuple("css:S4647", "css-issues-project:src/file3.scss"),
        tuple("css:S4663", "css-issues-project:src/file3.scss"),
        tuple("css:S4652", "css-issues-project:src/file3.scss"),
        tuple("css:S4656", "css-issues-project:src/file3.scss"),
        tuple("css:S4649", "css-issues-project:src/file3.scss"),
        tuple("css:S4648", "css-issues-project:src/file3.scss"),
        tuple("css:S4654", "css-issues-project:src/file3.scss"),
        tuple("css:S4657", "css-issues-project:src/file3.scss"),
        tuple("css:S4650", "css-issues-project:src/file3.scss"),
        tuple("css:S4650", "css-issues-project:src/file3.scss"),
        tuple("css:S4651", "css-issues-project:src/file3.scss"),
        tuple("css:S4666", "css-issues-project:src/file3.scss"),
        tuple("css:S4670", "css-issues-project:src/file3.scss"),
        tuple("css:S4662", "css-issues-project:src/file3.scss"),
        tuple("css:S4655", "css-issues-project:src/file3.scss"),
        tuple("css:S4658", "css-issues-project:src/file3.scss"),
        tuple("css:S4661", "css-issues-project:src/file3.scss"),
        tuple("css:S1116", "css-issues-project:src/file5.htm"),
        tuple("css:S1116", "css-issues-project:src/file6.vue"),
        tuple("css:S5362", "css-issues-project:src/file1.css"),
        tuple("css:S5362", "css-issues-project:src/file2.less"),
        tuple("css:S5362", "css-issues-project:src/file3.scss"),
        tuple("css:S1116", "css-issues-project:src/file5-1.html"),
        tuple("css:S125", "css-issues-project:src/file2.less")
      );
  }
}
