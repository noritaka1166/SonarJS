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
package org.sonar.plugins.javascript.analysis.cache;

import java.io.IOException;
import org.sonar.api.batch.sensor.SensorContext;

class CpdSerialization extends CacheSerialization {

  static final String DATA_PREFIX = "DATA";
  static final String STRING_TABLE_PREFIX = "STRING_TABLE";

  private final CacheSerialization cpdDataSerialization;
  private final CacheSerialization cpdStringTableSerialization;

  CpdSerialization(SensorContext context, CacheKey cacheKey) {
    super(context, cacheKey);
    cpdDataSerialization = new CacheSerialization(context, cacheKey.withPrefix(DATA_PREFIX));
    cpdStringTableSerialization = new CacheSerialization(
      context,
      cacheKey.withPrefix(STRING_TABLE_PREFIX)
    );
  }

  @Override
  boolean isInCache() {
    return cpdDataSerialization.isInCache() && cpdStringTableSerialization.isInCache();
  }

  @Override
  void copyFromPrevious() {
    cpdDataSerialization.copyFromPrevious();
    cpdStringTableSerialization.copyFromPrevious();
  }

  CpdData readFromCache() throws IOException {
    var data = cpdDataSerialization.readBytesFromCache();
    var stringTable = cpdStringTableSerialization.readBytesFromCache();
    return CpdDeserializer.fromBinary(data, stringTable);
  }

  void writeToCache(CpdData cpdData) throws IOException {
    var serializationResult = CpdSerializer.toBinary(cpdData);
    cpdDataSerialization.writeToCache(serializationResult.getData());
    cpdStringTableSerialization.writeToCache(serializationResult.getStringTable());
  }
}
