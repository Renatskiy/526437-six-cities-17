

import {TReviewOffer} from '../types/offerTypes';
type TProps = {
    review: TReviewOffer;
}
export default function ReviewItem(props: TProps){
  const {review} = props;
  const ratingWidth = 100 / 5 * review.rating;

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img className="reviews__avatar user__avatar"
            src={review.user.avatarUrl} width="54" height="54" alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">
          {review.user.name}
        </span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: `${ratingWidth}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">
          {review.comment}
        </p>
        <time className="reviews__time" dateTime="2019-04-24">April 2019</time>
      </div>
    </li>
  );
}
