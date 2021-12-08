/* fetchAllFeatures API - START */
function fetchAllFeatures() {
  return new Promise((resolve, _reject) => {
    const sampleFeatures = {
      "extended-summary": true,
      "feedback-dialog": false
    };

    setTimeout(resolve, 100, sampleFeatures);
  });
}
/* fetchAllFeatures API - END */


/* getFeatureState API - START */
let cachedAllFeatures = null;
let callInProgress = null;
function getFeatureState(featureFlag, defaultFeature) {
  let timer;
  const triggerCacheClear = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      cachedAllFeatures = null;
      callInProgress = null;
    }, 1000/* cacheExpirationTime */);
  };

  if (cachedAllFeatures) {
    if (cachedAllFeatures[featureFlag] !== undefined) {
      return Promise.resolve(cachedAllFeatures[featureFlag]);
    } else {
      return Promise.resolve(defaultFeature);
    }
  }

  const getFeatureFlag = () => {
    if (cachedAllFeatures && cachedAllFeatures[featureFlag] !== undefined) {
      return cachedAllFeatures[featureFlag];
    } else {
      return defaultFeature;
    }
  };

  // to avoid next request, in case a request is already in progress
  if (callInProgress) {
    return callInProgress.then(getFeatureFlag);
  }
  callInProgress = new Promise((resolve, _reject) => {
    if (cachedAllFeatures === null) {
      fetchAllFeatures().then((data) => {
        cachedAllFeatures = data;
        triggerCacheClear();
        resolve();
      }).catch(() => {
        resolve(defaultFeature);
      });
    }
  });
  return callInProgress.then(getFeatureFlag);
}
/* getFeatureState API - END */

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
