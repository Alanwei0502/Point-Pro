import { IMAGE_URL } from '~/constants';

const Video = () => {
  return (
    <video
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        objectFit: 'cover',
        objectPosition: '50% 50%',
      }}
      src={`${IMAGE_URL}KOH3og1.mp4`}
      autoPlay
      muted
      loop
    >
      <track src='captions_en.vtt' kind='descriptions' label='This is a video of a consumer purchasing and checking out.' />
    </video>
  );
};

export default Video;
