import Image from 'next/image';
import Link from 'next/link';
import Header from './index.style';
import logo from '../../../public/logo_m4u.svg';

function MainHeader() {
  return (
    <Header>
      <Link href="/" passHref>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>
          <Image src={logo} width={100} height={29} alt="Logo M4U" />
        </a>
      </Link>
    </Header>
  );
}

export default MainHeader;
