import React, { type FC, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import WatchlistIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton } from '@mui/material';
import classNames from 'classnames';
import { useToggleWatchlistMutation } from 'hooks/useFetchItems';
import globalize from 'lib/globalize';

interface WatchlistButtonProps {
    className?: string;
    isWatchlisted: boolean | undefined;
    itemId: string | null | undefined;
    queryKey?: string[]
}

const WatchlistButton: FC<WatchlistButtonProps> = ({
    className,
    isWatchlisted = false,
    itemId,
    queryKey
}) => {
    const queryClient = useQueryClient();
    const { mutateAsync: toggleWatchlistMutation } = useToggleWatchlistMutation();

    const onClick = useCallback(async () => {
        try {
            if (!itemId) {
                throw new Error('Item has no Id');
            }

            await toggleWatchlistMutation({
                itemId,
                isWatchlisted: isWatchlisted
            },
            { onSuccess: async() => {
                await queryClient.invalidateQueries({
                    queryKey,
                    type: 'all',
                    refetchType: 'active'
                });
            } });
        } catch (e) {
            console.error(e);
        }
    }, [isWatchlisted, itemId, queryClient, queryKey, toggleWatchlistMutation]);

    const btnClass = classNames(
        className,
        { 'ratingbutton-withrating': isWatchlisted }
    );

    const iconClass = classNames(
        { 'ratingbutton-icon-withrating': isWatchlisted }
    );

    return (
        <IconButton
            title={isWatchlisted ? globalize.translate('Watchlist') : globalize.translate('AddToWatchlist')}
            className={btnClass}
            size='small'
            onClick={onClick}
        >
            <WatchlistIcon className={iconClass} />
        </IconButton>
    );
};

export default WatchlistButton;
