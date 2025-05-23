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
package org.sonar.plugins.javascript.bridge;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import java.util.zip.GZIPInputStream;
import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.ArchiveInputStream;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.utils.IOUtils;

class BundleUtils {

  private BundleUtils() {
    // utility class
  }

  static void extractFromClasspath(InputStream resource, Path targetPath) throws IOException {
    Objects.requireNonNull(resource);
    try (
      InputStream stream = new GZIPInputStream(new BufferedInputStream(resource));
      ArchiveInputStream<TarArchiveEntry> archive = new TarArchiveInputStream(stream)
    ) {
      ArchiveEntry entry;
      while ((entry = archive.getNextEntry()) != null) {
        if (!archive.canReadEntryData(entry)) {
          throw new IllegalStateException("Failed to extract bundle");
        }
        Path entryFile = entryPath(targetPath, entry);
        if (entry.isDirectory()) {
          Files.createDirectories(entryFile);
        } else {
          Path parent = entryFile.getParent();
          Files.createDirectories(parent);
          try (OutputStream os = Files.newOutputStream(entryFile)) {
            IOUtils.copy(archive, os);
          }
        }
      }
    }
  }

  private static Path entryPath(Path targetPath, ArchiveEntry entry) {
    Path entryPath = targetPath.resolve(entry.getName()).normalize();
    if (!entryPath.startsWith(targetPath)) {
      throw new IllegalStateException(
        "Archive entry " + entry.getName() + " is not within " + targetPath
      );
    }
    return entryPath;
  }
}
