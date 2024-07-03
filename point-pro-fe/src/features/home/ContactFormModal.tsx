import { ReactElement, FC, Ref, forwardRef, useState, SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { CITY_LIST, CONTACT_TIME_LIST } from '~/utils';
import { Row } from '~/components';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction='up' ref={ref} {...props} />;
});
interface IContactFormModalProps {
  isOpenCallToActionModal: boolean;
  setIsOpenCallToActionModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface InquiryContent {
  [key: PropertyKey]: boolean | { [key: PropertyKey]: boolean } | string[];
}

export const ContactFormModal: FC<IContactFormModalProps> = (props) => {
  const { isOpenCallToActionModal, setIsOpenCallToActionModal } = props;

  const isOpen = isOpenCallToActionModal;

  const [formData, setFormData] = useState<InquiryContent>({
    quest: [],
  });

  const handleCloseCallToActionModal = () => {
    setIsOpenCallToActionModal(false);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // TODO: 驗證和提交表單
    handleCloseCallToActionModal();
    toast.success('表單已送出，我們將盡快與您聯繫');
    setFormData({ quest: [] });
  };

  // get Data
  const getData = (key: string) => {
    return key in formData ? formData[key] : '';
  };

  // Set data
  const setData = (key: string, value: any) => {
    return setFormData({ ...formData, [key]: value });
  };

  const handleCheckBoxChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      setData('quest', [...(formData.quest as string[]), target.name]);
    } else {
      setData(
        'quest',
        (formData.quest as string[]).filter((item) => item !== target.name),
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseCallToActionModal} TransitionComponent={Transition} keepMounted>
      <DialogTitle>聯絡資訊</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Row>
            <TextField
              required
              name='vendorName'
              label='商家姓名'
              fullWidth
              margin='dense'
              variant='standard'
              sx={{ m: 1, width: '50ch' }}
              value={getData('vendorName')}
              onChange={(e) => setData('vendorName', e.target.value)}
            />
            <FormControl component='fieldset' sx={{ m: 1, width: '50ch' }} margin='dense'>
              <FormLabel component='legend'>營業狀態</FormLabel>
              <RadioGroup row name='businessStatus' value={getData('businessStatus')} onChange={(e) => setData('businessStatus', e.target.value)}>
                <FormControlLabel value='已開業' control={<Radio />} label='已開業' />
                <FormControlLabel value='籌備中' control={<Radio />} label='籌備中' />
              </RadioGroup>
            </FormControl>
          </Row>
          <Row>
            <TextField
              required
              name='contactPerson'
              label='聯絡人'
              margin='dense'
              variant='standard'
              sx={{ m: 1, width: '50ch' }}
              value={getData('contactPerson')}
              onChange={(e) => setData('contactPerson', e.target.value)}
            />
            <TextField
              required
              name='phoneNumber'
              label='連絡電話'
              margin='dense'
              variant='standard'
              inputProps={{ inputMode: 'numeric', pattern: '^[0-9]{10}$' }}
              sx={{ m: 1, width: '50ch' }}
              value={getData('phoneNumber')}
              onChange={(e) => setData('phoneNumber', e.target.value)}
            />
          </Row>
          <Row>
            <TextField
              label='所在城市'
              required
              select
              name='city'
              variant='standard'
              sx={{ m: 1, width: '50ch' }}
              value={getData('city')}
              onChange={(e) => setData('city', e.target.value)}
            >
              {CITY_LIST.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label='希望聯絡時間'
              required
              select
              name='contactTime'
              variant='standard'
              sx={{ m: 1, width: '50ch' }}
              value={getData('contactTime')}
              onChange={(e) => setData('contactTime', e.target.value)}
            >
              {CONTACT_TIME_LIST.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
          </Row>
          <FormControl fullWidth margin='dense' sx={{ m: 1 }}>
            <FormLabel component='legend'>詢問內容 (可複選)</FormLabel>
            <FormGroup
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {[
                '限量優惠方案',
                'LINE 線上點餐系統',
                'QRCode掃碼點餐',
                '餐飲POS系統',
                '連鎖總部系統',
                '手機掃碼點餐APP',
                '外送平台串接',
                'API串接整合服務',
                'Kiosk 點餐機服務',
                '電子印章集點服務',
                '其他（請填寫）',
              ].map((content) => (
                <FormControlLabel
                  key={content}
                  label={content}
                  control={<Checkbox checked={(formData.quest as string[]).includes(content)} onChange={handleCheckBoxChange} name={content} />}
                />
              ))}
            </FormGroup>
          </FormControl>
          <TextField
            label='需求說明'
            name='requirement'
            fullWidth
            multiline
            rows={4}
            margin='dense'
            value={getData('requirement')}
            onChange={(e) => setData('requirement', e.target.value)}
          />
          <Button type='submit' fullWidth variant='contained' role='button' aria-label='submit'>
            送出表單
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
