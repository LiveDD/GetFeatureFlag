// fetchAllFeatures API - START
function fetchAllFeatures() {
  return new Promise((resolve) => {
    const sampleFeatures = {
      "extended-summary": true,
      "feedback-dialog": false
    };

    setTimeout(resolve, 100, sampleFeatures);
  });
}
// fetchAllFeatures API - START

// Problem statement
// - Write an API which can provide the specified feature flag.
// - If the feature flag doesn't exist or the API fails, we should return the defaultFeatureFlag.
// - The API should support caching, and it should have a cache expiration time.
// - When the API gets successive call, then also it should make only one call to the fetchAllFeatures API.
// getFeatureState API - START
let cachedAllFeatures = null;
let callInProgress = null;
let cacheExpirationTime = 1000;
function getFeatureState(featureFlag, defaultFeature) {
  let timeInterval;
  const triggerExpireCache = () => {
    if (timeInterval !== undefined) {
      clearTimeout(clearTimeout);
    }

    timeInterval = setTimeout(() => {
      cachedAllFeatures = null;
      callInProgress = null;
    }, cacheExpirationTime);
  };

  if (cachedAllFeatures) {
    if (cachedAllFeatures[featureFlag] !== undefined) {
      return Promise.resolve(cachedAllFeatures[featureFlag]);
    } else {
      return Promise.resolve(defaultFeature);
    }
  }

  const getFeatureFlag = () => {
    if (cachedAllFeatures[featureFlag] !== undefined) {
      return cachedAllFeatures[featureFlag];
    } else {
      return defaultFeature;
    }
  };

  if (callInProgress) {
    return callInProgress.then(getFeatureFlag);
  }
  callInProgress = new Promise(async (resolve) => {
    try {
      if (cachedAllFeatures === null) {
        cachedAllFeatures = await fetchAllFeatures();
        triggerExpireCache();
        resolve();
      }
    } catch {
      resolve(defaultFeature);
    }
  });
  return callInProgress.then(getFeatureFlag);
}
// getFeatureState API - END

// PLACEHOLDERS - START
function showExtendedSummary() {
  console.log("Show extended summary");
}

function showBriefSummary() {
  console.log("Show brief summary");
}

function makeFeedbackButtonVisible() {
  console.log("Feedback button visible.");
}
// PLACEHOLDERS - END

// Call to the feature flag API - START
getFeatureState("extended-summary", false).then(function (isEnabled) {
  if (isEnabled) {
    showExtendedSummary();
  } else {
    showBriefSummary();
  }
});

getFeatureState("feedback-dialog", true).then(function (isEnabled) {
  if (isEnabled) {
    makeFeedbackButtonVisible();
  } else {
    console.log("Feedback button not visible.");
  }
});

setTimeout(
  () =>
    getFeatureState("feedback-dialog", true).then(function (isEnabled) {
      if (isEnabled) {
        makeFeedbackButtonVisible();
      } else {
        console.log("Feedback button not visible.");
      }
    }),
  1000
);

setTimeout(
  () =>
    getFeatureState("extended-summary", false).then(function (isEnabled) {
      if (isEnabled) {
        showExtendedSummary();
      } else {
        showBriefSummary();
      }
    }),
  10000
);
// Call to the feature flag API - END
