# Problem statement

- Write an API which can provide a specified feature flag.
- If the feature flag doesn't exist or the API fails, we should return the defaultFeatureFlag passed as second parameter.
- The API should support caching, and it should have a cache expiration time.
- When the API gets successive call, then also it should make only one call to the fetchAllFeatures API.
