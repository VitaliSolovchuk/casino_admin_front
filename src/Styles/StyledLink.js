
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  });
  
export default StyledLink;
