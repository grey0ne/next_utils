import { Box, Chip, Grid, Typography } from '@mui/material';
import BannerBackground from '../assets/topography.svg'

const BANNER_STYLE = {
    position: 'relative',
    width: '100%',
    height: '300px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: 2,
    mb: 3,
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    }
}

const CONTENT_STYLE = {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    p: 3,
    color: 'white',
}

const TITLE_STYLE = {
    flexGrow: 1,
    textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
    fontWeight: 'bold'
}

type TopTagData = {
    label: string;
    color: string;
}

type BannerHeaderProps = {
    title: string;
    bannerImageUrl?: string;
    topTags?: TopTagData[];
    bottomTags?: string[];
    extraButtons?: React.ReactNode[];
}

export function BannerHeader({ bannerImageUrl, title, topTags = [], bottomTags = [], extraButtons = [] }: BannerHeaderProps) {
    const bottomTagElems = bottomTags.map((tag) => (
        <Typography variant="body2" sx={{ opacity: 0.9 }} key={tag}>
            {tag}
        </Typography>
    ))

    const backgroundImage = bannerImageUrl ? `url(${bannerImageUrl})` : `url(${BannerBackground.src})`

    const topTagElems = topTags.map((tag) => (
        <Chip 
            label={tag.label}
            size="small"
            sx={{ backgroundColor: tag.color, color: 'white' }}
            key={tag.label}
        />
    ))
    return (
        <Box sx={{...BANNER_STYLE, backgroundImage: backgroundImage}} >
               <Box sx={CONTENT_STYLE} >
                   <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                       {topTagElems}
                   </Box>

                   <Box>
                       <Grid container size={{xs: 12}} alignItems="flex-end">
                           <Typography variant='h3' sx={TITLE_STYLE}>
                               {title}
                           </Typography>
                           { extraButtons }
                       </Grid>
                       
                       {/* Additional meta info */}
                       <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            { bottomTagElems }
                       </Box>
                   </Box>
               </Box>
           </Box>
    )
}