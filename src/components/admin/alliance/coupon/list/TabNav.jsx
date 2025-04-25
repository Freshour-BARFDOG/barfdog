import s from '../allianceCoupon.module.scss';
import { useRouter } from "next/router";

const TabNav = ({ handleTabChange }) => {
	const router = useRouter();
	const { tab } = router.query;


	return (
		<div className={s.couponListTabNav}>
			<button
				onClick={() => handleTabChange('ACTIVE')}
				className={`${s.couponListTabBtn} ${tab === 'ACTIVE' || !tab ? s.active : ''}`}
			>
				활성 쿠폰
			</button>
			<button
				onClick={() => handleTabChange('INACTIVE')}
				className={`${s.couponListTabBtn} ${tab === 'INACTIVE' ? s.active : ''}`}
			>
				삭제 쿠폰
			</button>
		</div>
	);
};

export default TabNav;