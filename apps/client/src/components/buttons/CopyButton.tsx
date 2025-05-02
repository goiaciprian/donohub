import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Clipboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export const CopyButton = ({ url, size, variant }: { url: string; size?: number, variant?: Parameters<typeof Button>[0]['variant'] }) => {
  const { t } = useTranslation();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant={variant}
            size="icon"
            onClick={() =>
              navigator.clipboard
                .writeText(url)
                .then(() => toast.success(t('toast.copyLink.success')))
                .catch(() => toast.error(t('toast.copyLink.error')))
            }
          >
            <Clipboard size={size} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('tooltip.copy')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
