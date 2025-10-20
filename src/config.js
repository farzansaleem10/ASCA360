// Use relative path by default so CRA's proxy (package.json) can forward requests to backend during dev
const backendUrl = process.env.REACT_APP_BACKEND_URL || "/api";

export default backendUrl;
