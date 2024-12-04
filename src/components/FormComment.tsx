import { useState } from 'react';

export default function FormComment(){

  const [Form, SetForm] = useState({
    rating: '0',
    comment: ''
  });

  const [AbleButton, SetAbleButton] = useState(false);
  const checkDisabled = () =>{
    if(Form.rating && Form.comment.length >= 50){
      SetAbleButton(true);
    }else{
      SetAbleButton(false);
    }
  };
  const handlerCommentForm = (event: React.ChangeEvent<HTMLElement>) => {
    const {value} = event.currentTarget as never;
    SetForm({ ...Form,
      comment: value
    });
    checkDisabled();
  };

  const arCor = [5,4,3,2,1];
  const clickRating = (ev: React.FormEvent<HTMLInputElement>) => {
    SetForm({
      ...Form,
      rating : ev.currentTarget.value});
    checkDisabled();
  };
  return (
    <form className="reviews__form form" action="#" method="post">
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {arCor.map((el) => (
          <span key={el}>
            <input onClick={clickRating} className="form__rating-input visually-hidden" name="rating" value={el} id={`${el}-stars`} type="radio" />
            <label htmlFor={`${el}-stars`} className="reviews__rating-label form__rating-label" title="perfect">
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </span>)) }
      </div>

      <textarea onChange={handlerCommentForm} className="reviews__textarea form__textarea" id="review" name="review" placeholder="Tell how was your stay, what you like and what can be improved"></textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
                                            To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button className="reviews__submit form__submit button" type="submit" disabled={!AbleButton}>Submit</button>
      </div>
    </form>
  );
}
