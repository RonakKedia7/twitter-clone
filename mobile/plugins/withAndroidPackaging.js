const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withAndroidPackaging(config) {
  return withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;

    if (!buildGradle.includes("META-INF/versions/9/OSGI-INF/MANIFEST")) {
      config.modResults.contents = buildGradle.replace(
        /android\s*{/,
        `android {
    packaging {
        resources {
            excludes += ["META-INF/versions/9/OSGI-INF/MANIFEST"]
        }
    }`,
      );
    }

    return config;
  });
};
