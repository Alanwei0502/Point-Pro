import prisma from '../client';

export function insertMeals() {
  return prisma.$transaction([
    prisma.$executeRaw`
      DELETE FROM meals;
    `,
    prisma.$executeRaw`
      DO $$
      DECLARE
        claypot_id UUID;
        stir_fried_assorted_id UUID;
        iron_plate_id UUID;
        rice_noodles_id UUID;
        hot_pot_id UUID;
        fire_roasted_id UUID;
        stir_fried_meat_id UUID;
        stir_fired_seafood_id UUID;
        soup_id UUID;
        deep_fried_id UUID;
        three_cups_id UUID;
        vegetables_id UUID;
        a_la_carte_non_alcoholic_id UUID;
      BEGIN
      SELECT id INTO claypot_id FROM categories WHERE title = '煲類';
      SELECT id INTO stir_fried_assorted_id FROM categories WHERE title = '熱炒什錦類';
      SELECT id INTO iron_plate_id FROM categories WHERE title = '鐵板類';
      SELECT id INTO rice_noodles_id FROM categories WHERE title = '飯麵類';
      SELECT id INTO hot_pot_id FROM categories WHERE title = '火鍋類';
      SELECT id INTO fire_roasted_id FROM categories WHERE title = '火烤類';
      SELECT id INTO stir_fried_meat_id FROM categories WHERE title = '熱炒肉類';
      SELECT id INTO stir_fired_seafood_id FROM categories WHERE title = '熱炒海鮮類';
      SELECT id INTO soup_id FROM categories WHERE title = '湯類';
      SELECT id INTO deep_fried_id FROM categories WHERE title = '酥炸類';
      SELECT id INTO three_cups_id FROM categories WHERE title = '三杯類';
      SELECT id INTO vegetables_id FROM categories WHERE title = '青菜類';
      SELECT id INTO a_la_carte_non_alcoholic_id FROM categories WHERE title = '單點及無酒精飲料';

      INSERT INTO
      meals (title, price, image_id, image_delete_hash, description, is_popular, category_id)
      VALUES
        ('烤魚下巴', 180, 'j9KWjUV', 'EkBobt6iMWP1R48', '現烤現做需要25分左右', TRUE, fire_roasted_id),
        ('秋刀魚', 180, 'zKY1fxZ', 'EBUkjjwYnseGixu', '現烤現做需要25分左右', FALSE, fire_roasted_id),
        ('烤日式鯖魚', 180, 'bXHNho1', '7YFBcxwnUQ5J9pV', '現烤現做需要25分左右', TRUE, fire_roasted_id),
        ('鹽豬肉', 210, 'AwKkVzt', 'Vmq4kyREoM09GYE', '現烤現做需要25分左右\n肉品原產地：臺灣豬肉', FALSE, fire_roasted_id),
        ('牛小排', 220, 'g0SNCVF', 'mvGdRIIpAcnq5D2', '現烤現做需要25分左右', TRUE, fire_roasted_id),
        ('烤松阪豬肉', 270, '9XVSnDS', 'MtF39y0AeM9xYBV', '現烤現做需要25分左右\n肉品原產地：西班牙豬肉', TRUE, fire_roasted_id),
        ('烤櫻桃鴨肉串(4串)', 230, 'osdrizP', 'wDkz5m6Rd73Nmzh', '現烤現做需要25分左右', FALSE, fire_roasted_id),
        ('安格斯牛小排', 520, 'XeIzmi2', 'FM5mKVuZLttA2F9', '', FALSE, fire_roasted_id),
        ('烤鮭魚肚', 320, 'tvJCOoz', 'ovPjL1eJGZlcTJ0', '約250g', TRUE, fire_roasted_id),
        ('烤鮭魚頭(半顆)', 350, 'pTHIigC', 'xGKJMelPz4r1TWv', '', FALSE, fire_roasted_id),
        ('港都海產鍋(大)', 1100, 'mdY1Iq8', '5Pj6KZEcNoLZrjh', '使用產銷履歷鱸魚\n此餐點需要25分以上', FALSE, hot_pot_id),
        ('港都海產鍋(小)', 600, 'mdY1Iq8', '5Pj6KZEcNoLZrjh', '使用產銷履歷鱸魚', FALSE, hot_pot_id),
        ('生綠竹筍雞鍋(大)', 800, 'NHtDGhy', 'HPIIkyaFbNrL9Yb', '使用產銷履歷雞肉\n生綠竹筍為季節限定', FALSE, hot_pot_id),
        ('生綠竹筍雞鍋(小)', 480, 'NHtDGhy', 'HPIIkyaFbNrL9Yb', '使用產銷履歷雞肉\n生綠竹筍為季節限定', FALSE, hot_pot_id),
        ('鰱魚頭鍋(大)', 1100, 'Hr23apD', 'lr4t1w0erM1jBSX', '', FALSE, hot_pot_id),
        ('鰱魚頭鍋(小)', 600, 'Hr23apD', 'lr4t1w0erM1jBSX', '', FALSE, hot_pot_id),
        ('鳳梨苦瓜雞鍋(大)', 800, 'ftDe1C1', 'qAPW9i9kpt90XtD', '使用產銷履歷雞肉', FALSE, hot_pot_id),
        ('鳳梨苦瓜雞鍋(小)', 480, 'ftDe1C1', 'qAPW9i9kpt90XtD', '使用產銷履歷雞肉', FALSE, hot_pot_id),
        ('陳年菜甫雞鍋(大)', 800, 'b3Q9fpc', 'XWsrsVyyn5joVP6', '使用產銷履歷雞肉', FALSE, hot_pot_id),
        ('陳年菜甫雞鍋(小)', 480, 'b3Q9fpc', 'XWsrsVyyn5joVP6', '使用產銷履歷雞肉', FALSE, hot_pot_id),
        ('養生百菇雞鍋(大)', 980, 'u9EVSnv', 'ECTNBjRb9ItzmC0', '使用產銷履歷雞肉', FALSE, hot_pot_id),
        ('養生百菇雞鍋(小)', 565, 'u9EVSnv', 'ECTNBjRb9ItzmC0', '使用產銷履歷雞肉', FALSE, hot_pot_id),
        ('肉絲炒飯', 110, 'Iaj8sBS', '0K25g1MawPylG7A', '肉品原產地：臺灣豬肉', FALSE, rice_noodles_id),
        ('肉絲炒麵', 110, 'Zr9Vc65', 'i8IYWkVFZBrZvBu', '肉品原產地：臺灣豬肉', FALSE, rice_noodles_id),
        ('牛肉炒飯', 135, '5NOwvea', 'H7UXm0m62mqvoxe', '', FALSE, rice_noodles_id),
        ('牛肉炒麵', 135, 'YF4ek8p', 'G9GXfZ1ykzFNJnD', '', FALSE, rice_noodles_id),
        ('羊肉炒飯', 135, 'v0doJi7', 'S2Y3eJ47TecGdAp', '', FALSE, rice_noodles_id),
        ('羊肉炒麵', 135, '0cD1NYB', 'xwnJm79bEbZxy7a', '', FALSE, rice_noodles_id),
        ('蝦仁炒飯', 150, 'mzfopuu', '0Gpk6dxji7vThil', '使用產銷履歷白蝦', FALSE, rice_noodles_id),
        ('蝦仁炒麵', 150, 'gwzASrd', 'XJsinLqJME7RUnt', '使用產銷履歷白蝦', FALSE, rice_noodles_id),
        ('沙茶炒羊肉', 195, '4G91bdZ', 'XJsinLqJME7RUnt', '一般會用空心菜，用完會改用高麗菜。', FALSE, stir_fried_meat_id),
        ('沙茶炒牛肉', 195, 'kUBvQCE', 'imklu0flOG8XHMo', '一般會用空心菜，用完會改用高麗菜。', FALSE, stir_fried_meat_id),
        ('蔥爆牛肉', 220, '6aLB9Pp', 'skPGYHtkfzNh0q1', '肉品原產地：澳洲', FALSE, stir_fried_meat_id),
        ('糖醋排骨', 190, 'hy6XHz5', 'FbnglHVY3YOPGtJ', '肉品原產地：臺灣豬肉', FALSE, stir_fried_meat_id),
        ('糖醋里肌', 190, 'C78vYzN', '6RRzDg3djD9rh82', '肉品原產地：臺灣豬肉', TRUE, stir_fried_meat_id),
        ('炒回鍋肉', 195, '6s0HfaT', 'PYk5UZMCCbN4fI5', '肉品原產地：臺灣豬肉', TRUE, stir_fried_meat_id),
        ('蒜泥白肉', 190, 'mBBPP3o', 'A8CQgVRpUkMaHy8', '肉品原產地：臺灣豬肉', FALSE, stir_fried_meat_id),
        ('宮保雞丁', 190, 'GalPSXH', 'LuAY9HbcdkEc9Ty', '', TRUE, stir_fried_meat_id),
        ('橙汁排骨', 190, '8PCjvR9', '267au6BaasgPdQX', '肉品原產地：臺灣豬肉', FALSE, stir_fried_meat_id),
        ('地芋肥腸', 250, 'l1nspp9', 'FR9QkyLZR16HoyW', '肉品原產地：臺灣豬肉', TRUE, stir_fried_assorted_id),
        ('蒼蠅頭', 180, 'u2hrRi4', 'AjFSZYcTNey19Fr', '肉品原產地：臺灣豬肉', FALSE, stir_fried_assorted_id),
        ('鹹蛋炒苦瓜', 180, 'OpiQIlx', '5lDe63kMSMOha6t', '使用產銷履歷苦瓜', FALSE, stir_fried_assorted_id),
        ('鹹蛋炒竹筍', 195, 'GpikqEM', '6rCRVrIRNHMZQIf', '', FALSE, stir_fried_assorted_id),
        ('蚵仔炒蛋', 210, '2GlTWuQ', 'IoQeFGcJljHpnXq', '', FALSE, stir_fried_assorted_id),
        ('蝦仁炒蛋', 240, 'TRvix55', 'CIXDvdByraHSOCR', '使用產銷履歷白蝦', FALSE, stir_fried_assorted_id),
        ('菜脯炒蛋', 160, 'kWJF0w4', 'fMvbDkm2EoUxsIk', '', FALSE, stir_fried_assorted_id),
        ('客家小炒', 195, 'wbjFIa6', 'lqrgtnxoOBoHb9x', '肉品原產地：臺灣豬肉', TRUE, stir_fried_assorted_id),
        ('丁香炒花生', 200, 'hlXguAc', 'MSk0F5OGxkjVP7G', '', FALSE, stir_fried_assorted_id),
        ('老皮嫩肉', 200, '8F1GJti', '1Dbz6Fz9UznjbI4', '肉品原產地：臺灣豬肉', FALSE, stir_fried_assorted_id),
        ('麻婆豆腐', 180, 'xGhpd1q', 'DdKpRna2PofkaTO', '肉品原產地：臺灣豬肉', FALSE, stir_fried_assorted_id),
        ('紅燒豆腐', 180, 'OVCaFLR', '8i96DMZmh7AOgLu', '肉品原產地：臺灣豬肉', FALSE, stir_fried_assorted_id),
        ('蟹黃豆腐', 190, 'm3Rv5xn', 'Lw34Twh1kd6UrXq', '', FALSE, stir_fried_assorted_id),
        ('四季肥腸', 250, '09xjK4E', 'oXpkNb3vUbjj4Fo', '肉品原產地：歐洲豬肉', TRUE, stir_fried_assorted_id),
        ('薑絲大腸', 190, 'WrUyGSM', 'eRBCmSVcxpItHZL', '肉品原產地：臺灣豬肉', FALSE, stir_fried_assorted_id),
        ('麻油腰花', 280, 'AUGfVrP', 'yn1pGDqubnC6xT8', '肉品原產地：臺灣豬肉', TRUE, stir_fried_assorted_id),
        ('蠔油豬肝', 180, 'AhPfAfg', 'VpUSC2jOb7QZGtu', '肉品原產地：臺灣豬肉', FALSE, stir_fried_assorted_id),
        ('絲瓜蛤仔', 240, '71tKLB3', 'izQxAtz82dRYnwr', '使用產銷履歷絲瓜', FALSE, stir_fried_assorted_id),
        ('XO將頻果炒生干貝', 390, 'fYoJS5s', 'g8lAHobevLMAn2m', '', FALSE, stir_fried_assorted_id),
        ('白灼(燙)蝦', 320, '27MzfMA', 'uJEx4EZkOzkJl3G', '使用產銷履歷蝦', FALSE, stir_fired_seafood_id),
        ('芹菜炒花枝', 240, 'IA8CHtu', '8Fypard3aQIXpVX', '', FALSE, stir_fired_seafood_id),
        ('川燙透抽', 380, 'PIHmUgI', 'JxyYBd98nozW5fN', '', TRUE, stir_fired_seafood_id),
        ('塔香炒螺肉', 180, 'anyVTyB', 'd5T7FCLcEVSRAjp', '', FALSE, stir_fired_seafood_id),
        ('炒海瓜子', 250, 'JT7X9i8', 'ZTNEeSqXozTxtjW', '', TRUE, stir_fired_seafood_id),
        ('蒜泥大草蝦', 450, 'q4Acy23', 'ZTbinUQNtZsgoR8', '', FALSE, stir_fired_seafood_id),
        ('蒜泥蚵仔', 210, '8EzZ15F', 'HFz4jUgQvxpsTfg', '', FALSE, stir_fired_seafood_id),
        ('生炒三鮮', 230, '0DEDOtI', '374x0cj1bMpP4a7', '(水鯊、花枝、魷魚)', FALSE, stir_fired_seafood_id),
        ('泰式檸檬鱸魚', 430, 'IB3Va6d', 'pPb7CpjfeeQtQKp', '', TRUE, stir_fired_seafood_id),
        ('泰式檸檬蝦', 450, 'M0ahH1y', 'pAD9GX1HVm1Qtkh', '', FALSE, stir_fired_seafood_id),
        ('清蒸鱈魚', 300, 'WlrefLh', 'UbRfE6PRp2fMWNB', '', FALSE, stir_fired_seafood_id),
        ('豆酥鱈魚', 300, '5KFmwi0', '8W8HfA4dacSANXt', '', TRUE, stir_fired_seafood_id),
        ('橙汁鱸魚片', 240, 'FloObJR', 'mT5BAx0BHb5TxwE', '使用產銷履歷鱸魚', FALSE, stir_fired_seafood_id),
        ('糖醋鱸魚片', 240, 'hU8pi6w', 'naO3d2dOr12MtMy', '使用產銷履歷鱸魚', FALSE, stir_fired_seafood_id),
        ('蔥燒炒蟹', 450, 'aLpG8RV', 'MQHGQ94dQAW22V5', '', FALSE, stir_fired_seafood_id),
        ('避風塘炒蟹', 450, 'F6q33Oq', 'eJTlCS3joxaLipM', '', TRUE, stir_fired_seafood_id),
        ('炒蛤仔', 190, 'DaCJyLi', 'GpbFCBLEbQZHU4A', '', FALSE, stir_fired_seafood_id),
        ('泰式椒麻雞', 250, 'X8gDZhq', 'g1JBdqfhdM3q7yq', '', TRUE, deep_fried_id),
        ('鹽酥蝦', 280, 'HtWIwOh', 'TLt46XGEbp5RNHP', '使用產銷履歷蝦', FALSE, deep_fried_id),
        ('鹽酥龍珠', 210, 'BFiSJmV', 'Q9eQr9b106Sbb2p', '', FALSE, deep_fried_id),
        ('鳳梨蝦球', 290, 'P319wQy', 'ErlxYnjIBL9LKIH', '', TRUE, deep_fried_id),
        ('脆皮炸肥腸', 225, 'bGT0QCk', 'eNC9YiFyeXgrg7g', '肉品原產地：歐洲豬肉', FALSE, deep_fried_id),
        ('蚵仔酥', 210, '5ndxhok', 'gGlaTBSOlsaY0yE', '', FALSE, deep_fried_id),
        ('椒鹽大草蝦', 450, 'sCrFP3L', 'FyPS1ueia4v0CHv', '', FALSE, deep_fried_id),
        ('五味炸豆腐', 150, '9S2kCGb', 'vu1utqAm8JGWRd7', '', FALSE, deep_fried_id),
        ('酥炸三鮮(蝦仁、花枝、蚵仔)', 300, 'x7iKjVg', 'MOLMBrYci4gJZDz', '使用產銷履歷白蝦', FALSE, deep_fried_id),
        ('酥炸絲瓜', 180, 'wT7Eu2v', 'Cbug8pSOw6t5hFD', '使用產銷履歷絲瓜', FALSE, deep_fried_id),
        ('爆漿熔岩蝦球(7粒)', 270, 'EZU3jx3', 'TYgr0sntpoQHhZi', '', FALSE, deep_fried_id),
        ('鹽酥中卷', 280, 'RUsdVp9', 'IxNIzlUCukoft5k', '', FALSE, deep_fried_id),
        ('三杯雞', 250, 'PMJxWsQ', 'eS8OWFmrdUNgbsy', '', TRUE, three_cups_id),
        ('三杯中卷', 280, 'CwPsPFy', '3uDob4nW1R64JJ2', '', TRUE, three_cups_id),
        ('三杯豬肝', 200, 'lLHnkbP', 'AqnDvBkE3VgFLeI', '肉品原產地：臺灣豬肉', FALSE, three_cups_id),
        ('三杯皮蛋', 200, 'sTDShDY', 'vOWbPyBUo8U9Vvx', '', FALSE, three_cups_id),
        ('三杯田雞', 300, 'PMJxWsQ', 'eS8OWFmrdUNgbsy', '', FALSE, three_cups_id),
        ('鐵板牛柳', 280, 'O2lA6DS', '7AFe4iJi0uM4oTt', '肉品原產地：澳洲', TRUE, iron_plate_id),
        ('鐵板豆腐', 230, 'RKTMoCL', '056s76vRQHdfTs5', '肉品原產地：臺灣豬肉', FALSE, iron_plate_id),
        ('鐵板蚵仔', 250, 'U3gH6Gx', 'Shfsb2hNbT6tkt9', '', FALSE, iron_plate_id),
        ('鐵板豬肝', 200, 'FLcNKnK', '2ZOWJB3MIEdQbmH', '肉品原產地：臺灣豬肉', FALSE, iron_plate_id),
        ('五更腸旺', 250, '3WylZFD', 'ZbJlyEK42TKgtRk', '肉品原產地：歐洲豬肉', TRUE, claypot_id),
        ('茄子腸煲', 270, 'xI6vzKW', 'xAGnFY3AA8EfNes', '肉品原產地：歐洲豬肉', FALSE, claypot_id),
        ('茄子雞煲', 280, 'qk6xz1X', 'RNG8EDAsHnfayvB', '', FALSE, claypot_id),
        ('花雕雞煲', 300, 'nLqfV00', 'qGAcANDPIKR1lag', '', TRUE, claypot_id),
        ('炒高麗菜', 135, 'smxPOF5', '7K7DoL4CQYbrfMZ', '豬脂(油)原產地：臺灣豬肉', TRUE , vegetables_id),
        ('炒空心菜', 135, 'Mo2WtUy', 'RK5r0d9NL8jlqtC', '豬脂(油)原產地：臺灣豬肉', FALSE, vegetables_id),
        ('炒水蓮菜', 180, 'CXBOe4K', '0bDz3HYsNccRO8D', '肉品原產地：臺灣豬肉', FALSE, vegetables_id),
        ('杞子炒川七', 160, 'L4aEIfl', 'YtTuWrCF9cZsmc6', '', FALSE, vegetables_id),
        ('紅燒茄子', 160, '0ckynd2', 'pB8ycWt2YKwtVRh', '肉品原產地：臺灣豬肉', FALSE, vegetables_id),
        ('皮蛋地瓜葉', 195, 'Y0HjFNC', 'SPBvXK4EYAeIL5K', '肉品原產地：臺灣豬肉', FALSE, vegetables_id),
        ('燙地瓜葉', 160, 'VcXePn9', 'ILY9fLJVf85Z0AP', '肉品原產地：臺灣豬肉', TRUE , vegetables_id),
        ('乾煸四季豆', 185, '7defArj', 'mxx36pboblSSICA', '肉品原產地：臺灣豬肉', FALSE, vegetables_id),
        ('炒菠菜', 150, 'JAjbuYr', 'Ywd0WpVCqSXEzEy', '', FALSE, vegetables_id),
        ('薑絲鱸魚湯(大)', 380, 'q0H6LYD', 'tjPfcr35wo7wlxT', '使用產銷履歷鱸魚', FALSE, soup_id),
        ('薑絲鱸魚湯(中)', 200, 'q0H6LYD', 'tjPfcr35wo7wlxT', '使用產銷履歷鱸魚', FALSE, soup_id),
        ('薑絲鱸魚湯(小)', 110, 'q0H6LYD', 'tjPfcr35wo7wlxT', '使用產銷履歷鱸魚', FALSE, soup_id),
        ('味噌鱸魚湯(大)', 380, 'VMaT4pZ', 'Fr7E9aPEVd3Ao93', '使用產銷履歷鱸魚', FALSE, soup_id),
        ('味噌鱸魚湯(中)', 200, 'VMaT4pZ', 'Fr7E9aPEVd3Ao93', '使用產銷履歷鱸魚', FALSE, soup_id),
        ('味噌鱸魚湯(小)', 110, 'VMaT4pZ', 'Fr7E9aPEVd3Ao93', '使用產銷履歷鱸魚', FALSE, soup_id),
        ('蛤蠣湯(大)', 355, 'D1DTujm', '1C7sGJYTsQjLOxf', '', TRUE, soup_id),
        ('蛤蠣湯(中)', 185, 'D1DTujm', '1C7sGJYTsQjLOxf', '', TRUE, soup_id),
        ('蛤蠣湯(小)', 100, 'D1DTujm', '1C7sGJYTsQjLOxf', '', TRUE, soup_id),
        ('蚵仔湯(大)', 355, 'ThJxTpe', 'fQb2JnizoVf2aCA', '', FALSE, soup_id),
        ('蚵仔湯(中)', 185, 'ThJxTpe', 'fQb2JnizoVf2aCA', '', FALSE, soup_id),
        ('蚵仔湯(小)', 100, 'ThJxTpe', 'fQb2JnizoVf2aCA', '', FALSE, soup_id),
        ('豬肝湯(大)', 260, 'tcfXl1H', 'M7m266HrTxZAVFT', '肉品原產地：臺灣豬肉', FALSE, soup_id),
        ('豬肝湯(中)', 130, 'tcfXl1H', 'M7m266HrTxZAVFT', '肉品原產地：臺灣豬肉', FALSE, soup_id),
        ('豬肝湯(小)', 80, 'tcfXl1H', 'M7m266HrTxZAVFT', '肉品原產地：臺灣豬肉', FALSE, soup_id),
        ('番茄豆腐蛋花湯(大)', 260, '5s8SPsY', 'gBB2MANgNK4Z2WL', '', FALSE, soup_id),
        ('番茄豆腐蛋花湯(中)', 130, '5s8SPsY', 'gBB2MANgNK4Z2WL', '', FALSE, soup_id),
        ('番茄豆腐蛋花湯(小)', 80, '5s8SPsY', 'gBB2MANgNK4Z2WL', '', FALSE, soup_id),
        ('白飯', 20, '8SCHjC3', '79Ihdnjck4rZJir', '168g，每滿＄200有贈送1碗白飯(不包含炒飯麵、白飯及運費)，請再結帳頁面的附註上說明。這邊提供額外加點的服務', FALSE, a_la_carte_non_alcoholic_id),
        ('小菜毛豆', 50, 'i12sqQ2', 'n5N0u5g4GZeYx0P', '', FALSE, a_la_carte_non_alcoholic_id),
        ('聖沛黎洛 天然氣泡水', 100, 'oh8c7Sz', 'W9tegGhsyQ78OES', '750ml', FALSE, a_la_carte_non_alcoholic_id),
        ('老北京御品酸梅湯', 100, 'c2aHnqh', 'c26lxmMaShJ4kOi', '900ml', FALSE, a_la_carte_non_alcoholic_id),
        ('愛之味麥仔茶', 60, 'Jt3lPiL', 'd685wYVriRn2qDJ', '990ml', FALSE, a_la_carte_non_alcoholic_id),
        ('御茶園日式綠茶', 60, 'o5iYRG1', 'qzVjqQNIG50G5ho', '980ml', FALSE, a_la_carte_non_alcoholic_id),
        ('蘋果西打', 50, '2xwiLsb', 'KncwbZVM3c2d4KM', '600ml', FALSE, a_la_carte_non_alcoholic_id),
        ('可口可樂', 50, 'tCtv3RT', 'FVSAbT4VG86ZndR', '600ml', FALSE, a_la_carte_non_alcoholic_id),
        ('半天水椰子汁', 70, 'SyBYQ6i', '4yGESEUvcE66oGV', '520ml', FALSE, a_la_carte_non_alcoholic_id),
        ('泰山冰鎮紅茶', 60, 'F313swt', 'lfHVxusXPTVPg0p', '900ml', FALSE, a_la_carte_non_alcoholic_id),
        ('優鮮沛蔓越莓', 60, 'Ws6HMk5', 'uGFgFsdihS3OECo', '900ml', FALSE, a_la_carte_non_alcoholic_id),
        ('Sunkist芭樂汁', 60, 'QsP5Doe', 'NFvk6XxEQOPQC0N', '900ml', FALSE, a_la_carte_non_alcoholic_id),
        ('Sunkist柳橙汁', 60, 'bBbhE3z', 'ewbldwDBR0wTp0V', '900ml', FALSE, a_la_carte_non_alcoholic_id),
        ('蜂蜜檸檬(小)', 130, 'AFPd5lP', 'tak5Jb0hZYhAe0O', '500ml', FALSE, a_la_carte_non_alcoholic_id),
        ('蜂蜜檸檬(大)', 200, 'uIoIQXg', 'GBqsOa6Vrfn15A7', '800ml', FALSE, a_la_carte_non_alcoholic_id);
      END $$;
    `,
  ]);
}
