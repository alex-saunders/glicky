// @flow
import React from 'react';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import styled from 'styled-components';

import { type ThemeProps } from '~/theme';

import { BodyText, SkeletonScreen } from '~/components';

import AvatarChip from '../../AvatarChip/AvatarChip';
import { type Author } from '../../DependencyPanel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const VersionText = styled.div`
  margin-right: ${(p: ThemeProps) => p.theme.sizing('xxs')};
`;

const Publisher = styled.div`
  display: inline-block;
  margin: ${(p: ThemeProps) => p.theme.sizing('xs')} 0;
`;

type Props = {
  installedVersion: ?string,
  latestVersion: string,
  publishDate: string,
  publisher: Author
};

const Version = ({
  installedVersion,
  latestVersion,
  publishDate,
  publisher
}: Props) => (
  <Container>
    <VersionText>
      <BodyText>
        {'Latest version is '}
        <BodyText colour="accent">{latestVersion}</BodyText>
        {', which was published '}
        <BodyText colour="accent">
          {distanceInWordsToNow(publishDate)} ago
        </BodyText>
        {' by'}
      </BodyText>
    </VersionText>
    <Publisher>
      <AvatarChip name={publisher.name} email={publisher.email} />
    </Publisher>
    {installedVersion ? (
      <BodyText>
        {'You have version '}
        <BodyText colour="accent">{`${installedVersion} installed`}</BodyText>
      </BodyText>
    ) : (
      <SkeletonScreen width={4} absoluteWidth={193} />
    )}
  </Container>
);

export default Version;
