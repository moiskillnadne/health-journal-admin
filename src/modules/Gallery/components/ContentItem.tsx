import * as React from 'react';
import { styled, InputLabel, MenuItem, Menu, IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { formatDataSize, formatDate } from '@app/utils';
import { useIsSuperAdmin } from '@app/hooks';

const ITEM_HEIGHT = 48;

type Props = {
  imgSrc: string;
  published: boolean;
  title: string;
  views?: number;
  size?: number | null;
  createdAt: string;
  type: 'video' | 'article' | 'recipe' | 'foodVideo';
  videoType?: string;
  onDelete: () => void;
  onEdit: () => void;
  onPublish: () => void;
};

const VideoHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const VideoBlock = styled('div')(() => ({
  width: '200px',
  margin: '10px',
}));

const VideoPreview = styled('img')(() => ({
  width: '200px',
  height: '145px',
}));

const PublishedBlock = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

const MetaInfoBlock = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

const ViewsBlock = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
}));

const SizeAndDateBlock = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
}));

const VideoPreviewBlock = styled('div')(() => ({
  position: 'relative',
}));

const COLORS = {
  PUBLISHED: '#3ea832',
  UNPUBLISHED: '#fd9b32',
};

const PublishedIndicator = styled('div')((props: { published: boolean }) => ({
  borderRadius: '50%',
  width: '8px',
  height: '8px',
  marginRight: '4px',
  backgroundColor: props?.published ? COLORS.PUBLISHED : COLORS.UNPUBLISHED,
}));

const MenuIconButton = styled(IconButton)(() => ({
  left: '10px',
}));

const PlayButton = styled(PlayCircleFilledWhiteIcon)(() => ({
  position: 'absolute',
  width: '28px',
  height: '28px',
  left: '50%',
  top: '50%',
  marginLeft: '-14px',
  marginTop: '-14px',
  color: '#ffffff',
  opacity: '60%',
}));

export default function ContentItem(props: Props) {
  const {
    imgSrc,
    published,
    title,
    views,
    size,
    createdAt,
    type,
    videoType,
    onDelete,
    onEdit,
    onPublish,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isAdmin = useIsSuperAdmin();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const typeText = videoType ? (videoType === 'food' ? 'Food Video' : 'Video') : type;

  return (
    <VideoBlock>
      <VideoHeader>
        <PublishedBlock>
          <PublishedIndicator published={published} />
          <InputLabel
            disableAnimation
            sx={{ transform: 'none', color: '#333333', fontWeight: 600 }}>
            {published ? 'Published' : 'Unpublished'}
          </InputLabel>
        </PublishedBlock>
        <div>
          <div>
            <MenuIconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}>
              <MoreHorizIcon />
            </MenuIconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClick={handleClose}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                },
              }}>
              <MenuItem key={'Publish'} onClick={onPublish}>
                {!published ? 'Published' : 'Unpublished'}
              </MenuItem>
              {isAdmin && (
                <MenuItem key={'Delete'} onClick={onDelete}>
                  Delete
                </MenuItem>
              )}
              <MenuItem key={'Edit'} onClick={onEdit}>
                Edit
              </MenuItem>
            </Menu>
          </div>
        </div>
      </VideoHeader>
      <VideoPreviewBlock>
        <VideoPreview src={imgSrc} />
        {type.toLocaleLowerCase().includes('video') && <PlayButton />}
      </VideoPreviewBlock>
      <InputLabel
        disableAnimation
        sx={{ transform: 'none', color: '#333333', textTransform: 'uppercase', mb: '8px' }}>
        {typeText}
      </InputLabel>
      <InputLabel disableAnimation sx={{ transform: 'none', color: '#333333', fontWeight: 600 }}>
        {title}
      </InputLabel>
      <MetaInfoBlock>
        {/* <ViewsBlock>
          <InputLabel disableAnimation>{views} Views</InputLabel>
        </ViewsBlock> */}
        <SizeAndDateBlock>
          <InputLabel disableAnimation>{formatDate(createdAt)}</InputLabel>
          {size && <InputLabel>{formatDataSize(size)}</InputLabel>}
        </SizeAndDateBlock>
      </MetaInfoBlock>
    </VideoBlock>
  );
}
