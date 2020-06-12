const QUERY = (body, origin_data) => {
  return Promise.resolve(
    fetch("https://194.87.95.37/graphql", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",
        Authorization: origin_data ? "Bearer " + origin_data : "",
      },
    })
  );
};

export default QUERY;
