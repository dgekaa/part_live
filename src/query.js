const QUERY = (body, origin_data) => {
  console.log(origin_data, "_____________________origin_data !!!!!!!!!!!");
  return Promise.resolve(
    fetch("http://194.87.95.37/graphql", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: origin_data ? "Bearer " + origin_data : "",
      },
    })
  );
};

export default QUERY;
