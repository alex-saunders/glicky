// @flow
import React, { Component, type Node } from 'react';
import styled, { css } from 'styled-components';

import { type ThemeProps, type ThemedComponent } from '~/theme';

const border = css`1px solid ${(p: ThemeProps) => p.theme.colour('border')};`;

const SCTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

type CellProps = {
  numeric: boolean
};
export const Cell: ThemedComponent<CellProps> = styled.td`
  ${({ theme }: ThemeProps) => css`
    padding: ${theme.sizing('md')} ${theme.sizing('lg')} ${theme.sizing('md')}
      ${theme.sizing('md')};
  `};

  font-size: ${(p: ThemeProps) => p.theme.fontSize('sm1')};
  text-align: ${(p: CellProps) => (p.numeric ? 'right' : 'left')};
`;

export const Row = styled.tr`
  &:not(:last-of-type) {
    ${Cell} {
      border-bottom: ${border};
    }
  }
`;

const Head = styled.thead`
  & ${Cell} {
    color: ${(p: ThemeProps) => p.theme.colour('grey')};
    font-weight ${(p: ThemeProps) => p.theme.fontWeight('bold')};
    font-size: ${(p: ThemeProps) => p.theme.fontSize('sm2')};
    text-transform: capitalize;
    border-bottom: ${border}
  }
`;

const Body = styled.tbody``;

type Props = {
  renderHead: () => Node,
  children: Node,
  className?: string
};

export default class Table extends Component<Props, *> {
  render() {
    const { renderHead, children, className } = this.props;
    return (
      <SCTable className={className}>
        <Head>{renderHead()}</Head>
        <Body>{children}</Body>
      </SCTable>
    );
  }
}
