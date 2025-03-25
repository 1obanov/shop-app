import React from "react";
import { Star, StarHalf } from "lucide-react";

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <div className="stars__ico" key={i}>
          <Star
            key={i}
            strokeWidth="1.2"
            size="14"
            fill="#4f7561"
            stroke="#4f7561"
          />
        </div>
      );
    } else if (i === fullStars && halfStar) {
      stars.push(
        <div className="stars__ico" key={i}>
          <StarHalf
            strokeWidth="1.2"
            size="14"
            fill="#4f7561"
            stroke="#4f7561"
          />
          <StarHalf
            strokeWidth="1.2"
            size="14"
            stroke="#4f7561"
            className="star-half--rotate"
          />
        </div>
      );
    } else {
      stars.push(
        <div className="stars__ico" key={i}>
          <Star key={i} strokeWidth="1.2" size="14" stroke="#7e7e7e" />
        </div>
      );
    }
  }

  return stars;
};

export { renderStars };
