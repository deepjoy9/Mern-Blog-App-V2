import React from "react";

const ShimmerUI = () => {
  return (
    <div className="shimmer-post">
      <div className="shimmer-image"></div>
      <div className="shimmer-texts">
        <h2 className="shimmer-title"></h2>
        <p className="shimmer-info"></p>
        <p className="shimmer-summary"></p>
      </div>
    </div>
  );
};

const ShimmerList = () => {
  const shimmerBoxCount = 5;
  const shimmerBoxes = Array.from({ length: shimmerBoxCount }, (_, index) => (
    <ShimmerUI key={index} />
  ));

  return <>{shimmerBoxes}</>;
};

export default ShimmerList;
