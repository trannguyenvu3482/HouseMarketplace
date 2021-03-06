import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Spinner } from '../components';

const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  useEffect(() => {}, []);

  if (loading) return <Spinner />;

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommmended</p>

        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 5000 }}
        >
          {listings.map(({ data, id }) => {
            return (
              <SwiperSlide
                key={id}
                onClick={() => {
                  navigate(`/category/${data.type}/${id}`);
                }}
                style={{ height: 200 }}
              >
                <div
                  className="swiperSlideDiv"
                  style={{
                    background: `url(${data.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                >
                  <p className="swiperSlideText">{data.name}</p>
                  <p className="swiperSlidePrice">
                    ${data.discountedPrice ?? data.regularPrice}{' '}
                    {data.type === 'rent' ? '/ month' : ''}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    )
  );
};

export default Slider;
