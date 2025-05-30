/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2025 SonarSource SA
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
package org.sonar.plugins.javascript.rules;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.sonar.api.rules.RuleType;
import org.sonar.api.server.rule.RulesDefinition;

class TslintRulesDefinitionTest {

  private static int NUMBER_TSLINT_RULES = 144;

  @Test
  void test_external_repositories() {
    TslintRulesDefinition rulesDefinition = new TslintRulesDefinition();
    RulesDefinition.Context context = new RulesDefinition.Context();
    rulesDefinition.define(context);
    RulesDefinition.Repository tslintRepository = context.repository("external_tslint_repo");

    assertThat(context.repositories()).hasSize(1);
    assertThat(tslintRepository.name()).isEqualTo("TSLint");
    assertThat(tslintRepository.language()).isEqualTo("ts");
    assertThat(tslintRepository.isExternal()).isEqualTo(true);
    assertThat(tslintRepository.rules().size()).isGreaterThan(NUMBER_TSLINT_RULES);

    RulesDefinition.Rule tsLintRule = tslintRepository.rule("adjacent-overload-signatures");
    assertThat(tsLintRule).isNotNull();
    assertThat(tsLintRule.name()).isEqualTo("Enforces function overloads to be consecutive.");
    assertThat(tsLintRule.type()).isEqualTo(RuleType.CODE_SMELL);
    assertThat(tsLintRule.severity()).isEqualTo("MAJOR");
    String adjacentOverloadSignaturesDoc =
      "https://palantir.github.io/tslint/rules/adjacent-overload-signatures";
    assertThat(tsLintRule.htmlDescription()).isEqualTo(
      "See description of TSLint rule <code>adjacent-overload-signatures</code> at the <a href=\"" +
      adjacentOverloadSignaturesDoc +
      "\">TSLint website</a>."
    );
    assertThat(tsLintRule.tags()).isEmpty();
    assertThat(tsLintRule.debtRemediationFunction().baseEffort()).isEqualTo("5min");

    RulesDefinition.Rule sonartsRule = tslintRepository.rule("cognitive-complexity");
    assertThat(sonartsRule).isNotNull();
    assertThat(sonartsRule.name()).isEqualTo(
      "Cognitive Complexity of functions should not be too high"
    );
    assertThat(sonartsRule.type()).isEqualTo(RuleType.CODE_SMELL);
    assertThat(sonartsRule.severity()).isEqualTo("MAJOR");
    String cognitiveComplexityDoc =
      "https://github.com/SonarSource/SonarTS/tree/1.9.0.3766/sonarts-core/docs/rules/cognitive-complexity.md";
    assertThat(sonartsRule.htmlDescription()).isEqualTo(
      "See description of tslint-sonarts rule <code>cognitive-complexity</code> at the <a href=\"" +
      cognitiveComplexityDoc +
      "\">tslint-sonarts website</a>."
    );
    assertThat(sonartsRule.tags()).isEmpty();
    assertThat(sonartsRule.debtRemediationFunction().baseEffort()).isEqualTo("5min");
  }
}
