﻿import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Badge, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import ViewSwitch from '../../shared-components/view-switch';
import { UserMenu } from '../../shared-components/user-menu/user-menu';
import { Thanks } from '../../shared-components/thanks';
import { discordInvitationLink } from '../../models/constants';
import CampaignIcon from '@mui/icons-material/Campaign';
import { StoreContext } from '../../reducers/store.provider';
import { WhatsNewDialog } from '../../shared-components/whats-new.dialog';
import IconButton from '@mui/material/IconButton';
import { DiscordIcon } from '../../shared-components/icons/discord.icon';

export const Home = () => {
    const { seenAppVersion } = useContext(StoreContext);

    const [showWhatsNew, setShowWhatsNew] = useState(false);

    const hasNewVersion = useMemo(() => {
        const currentAppVersion = localStorage.getItem('appVersion');
        return currentAppVersion === seenAppVersion;
    }, [seenAppVersion]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <ViewSwitch />
                    <Tooltip title="What's new">
                        <IconButton onClick={() => setShowWhatsNew(true)}>
                            <Badge color="secondary" variant="dot" invisible={hasNewVersion}>
                                <CampaignIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Join Tacticus Planner community on Discord">
                        <IconButton component={Link} to={discordInvitationLink} target={'_blank'}>
                            <DiscordIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <UserMenu />
            </div>

            <Thanks />

            <h3 style={{ textAlign: 'center' }}>F.A.Q. and Instructions</h3>

            <div>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>What is this web app?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>
                            This web is made to make your planning in the mobile title{' '}
                            <a href="https://tacticusgame.com/" target={'_blank'} rel="noreferrer">
                                Warhammer 40K Tacticus.
                            </a>{' '}
                            easier.
                        </p>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>What does it do?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>
                            You can use it to find out which of your chars are the best for each Legendary Event and an
                            overall rating.
                        </p>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>What features it has?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>
                            {' '}
                            &quot;Who You Own&quot; - You enter which characters you have unlocked and what rank they
                            are.
                        </p>
                        <p> &quot;Characters&quot; - View and filter characters stats.</p>
                        <p>
                            {' '}
                            &quot;Dirty Dozen&quot; -
                            <Link
                                to={'https://tacticus.fandom.com/wiki/Infographics#Dirty_Dozen_Series'}
                                target={'_blank'}>
                                Nandi&apos;s
                            </Link>{' '}
                            DirtyDozen infographic in table format
                        </p>
                        <p>
                            {' '}
                            &quot;Legendary Events&quot; - page contains all future Legendary events with target dates
                        </p>
                        <ul>
                            <li>
                                Characters filters - use to show only characters you have unlocked or characters that
                                are required for campaigns.
                            </li>
                            <li>
                                Event Details - All the details of which characters can do participate in each match per
                                track i.e. Alpha/Beta/Gamma.
                            </li>
                            <li>
                                Your Selected Teams - table of characters you&apos;ve selected for each track i.e.
                                Alpha/Beta/Gamma.
                            </li>
                            <li>
                                Event Best Characters - tables of characters that scores the most points in the event
                                (Best Overall, Your Best, Selected Best).
                            </li>
                            <li>
                                Overall Best Characters - same as &quot;Event Best Characters&quot; except it displayed
                                combined data from all legendary events
                            </li>
                        </ul>
                        <p>
                            {' '}
                            &quot;Import&quot; - Import your personal data that you&apos;ve backed up with Export
                            feature.
                        </p>
                        <p>
                            {' '}
                            &quot;Export&quot; - Back up personal data on your device to import it in case of current
                            state is lost.
                        </p>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>How do I use it?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>
                            1. Go to the &quot;Who You Own&quot; page, check characters you have unlocked and set the
                            current rank of your characters in the drop down menu.{' '}
                        </p>
                        <p>
                            2. Go to the &quot;Legendary Events&quot; page then to specific event and select your teams
                            on the Event Details table{' '}
                        </p>
                        <p>
                            3. View &quot;Event Best Characters&quot; table to understand what characters you should
                            prioritize in preparation for the legendary event
                        </p>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>I found a bug? I have an idea? I want to reach you out?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>
                            Send email to{' '}
                            <a href="mailto: tacticusplanner@gmail.com" target={'_blank'} rel="noreferrer">
                                tacticusplanner@gmail.com
                            </a>{' '}
                            or reach me out in{' '}
                            <a href={discordInvitationLink} target={'_blank'} rel="noreferrer">
                                Discord
                            </a>
                        </p>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>What is planned for next release?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>Add server level data backup</p>
                        <p>Remove redundant data to decrease size of data file</p>
                        <p>Reminder to backup your data</p>
                        <p>Minor improvements and bug fixes</p>
                    </AccordionDetails>
                </Accordion>
            </div>
            <WhatsNewDialog isOpen={showWhatsNew} onClose={() => setShowWhatsNew(false)} />
        </div>
    );
};
