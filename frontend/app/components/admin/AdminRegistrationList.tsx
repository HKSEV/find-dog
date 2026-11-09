"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronLeft, FiChevronRight, FiRefreshCw, FiSearch, FiX } from "react-icons/fi";
import { AppDispatch, RootState } from "../../store/store";
import { fetchAdminRegistrations } from "../../redux/registrationAdminSlice";
import {
  AdminRegistrationKind,
  filterRegistrationRows,
  getRegistrationSources,
  registrationConfigs
} from "@/lib/adminRegistrations";
import * as S from "@/assets/css/Style.styles";

export default function AdminRegistrationList({kind}: {kind: AdminRegistrationKind}) {
  const dispatch = useDispatch<AppDispatch>();
  const {rows, status, failedSources} = useSelector((state: RootState) => state.registrationAdmin[kind]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const id = useId();
  const config = registrationConfigs[kind];
  const sources = getRegistrationSources(kind);
  const isLoading = status === "idle" || status === "loading";
  const filteredRows = useMemo(() => filterRegistrationRows(rows, query, category), [rows, query, category]);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / 10));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((currentPage - 1) * 10, currentPage * 10);
  const allFailed = failedSources.length === sources.length;

  useEffect(() => {
    const request = dispatch(fetchAdminRegistrations(kind));
    return () => request.abort();
  }, [dispatch, kind]);

  return (
    <S.AdminListPanel aria-labelledby={`${id}-title`} aria-busy={isLoading}>
      <S.AdminListHeader>
        <div>
          <S.AdminListTitle id={`${id}-title`}>{config.title}</S.AdminListTitle>
          <S.AdminListCount aria-live="polite">
            {isLoading
              ? "목록을 불러오는 중입니다."
              : `검색 결과 ${filteredRows.length.toLocaleString("ko-KR")}건 / 조회된 전체 ${rows.length.toLocaleString("ko-KR")}건`}
          </S.AdminListCount>
        </div>
        <S.AdminListRefresh
        type="button"
        disabled={isLoading}
        onClick={() => {
          setPage(1);
          dispatch(fetchAdminRegistrations(kind));
        }}>
          <FiRefreshCw aria-hidden="true"/>
          새로고침
        </S.AdminListRefresh>
      </S.AdminListHeader>
      <S.AdminListToolbar>
        <S.AdminListSearch role="search" aria-label={`${config.title} 검색`}>
          <S.AdminListSearchLabel htmlFor={`${id}-search`}>등록 목록 검색</S.AdminListSearchLabel>
          <FiSearch aria-hidden="true"/>
          <S.AdminListInput
          id={`${id}-search`}
          type="search"
          placeholder={config.placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}/>
        </S.AdminListSearch>
        {kind === "integrate" && (
          <S.AdminListFilter
          aria-label="게시물 유형 필터"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}>
            <option value="">전체 유형</option>
            {sources.map(({key, label}) => (
              <option key={key} value={label}>
                {label}
              </option>
            ))}
          </S.AdminListFilter>
        )}
        {(query || category) && (
          <S.AdminListClear
          type="button"
          onClick={() => {
            setQuery("");
            setCategory("");
            setPage(1);
          }}>
            <FiX aria-hidden="true"/>
            검색 초기화
          </S.AdminListClear>
        )}
      </S.AdminListToolbar>
      {!isLoading && failedSources.length > 0 && (
        <S.AdminListError role="alert">
          {failedSources.join(", ")} 목록을 불러오지 못했습니다.{" "}
          {allFailed ? "새로고침을 눌러 다시 시도해 주세요." : "조회된 유형의 항목만 표시합니다."}
        </S.AdminListError>
      )}
      <S.AdminListTableScroll>
        <S.AdminListTable aria-label={config.title}>
          <thead>
            <tr>
              {config.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading || !visibleRows.length ? (
              <tr>
                <S.AdminListEmpty colSpan={config.columns.length}>
                  {isLoading
                    ? "등록 목록을 불러오는 중입니다."
                    : allFailed
                      ? "목록을 불러오지 못했습니다."
                      : query || category
                        ? "검색 결과가 없습니다."
                        : "아직 등록된 항목이 없습니다."}
                </S.AdminListEmpty>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr key={row.key}>
                  {row.cells.map((cell, index) => (
                    <td key={config.columns[index]}>{cell}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </S.AdminListTable>
      </S.AdminListTableScroll>
      <S.AdminListPagination aria-label={`${config.title} 페이지`}>
        <S.AdminListPageButton
        type="button"
        aria-label="이전 페이지"
        disabled={isLoading || currentPage === 1}
        onClick={() => setPage(currentPage - 1)}>
          <FiChevronLeft aria-hidden="true"/>
        </S.AdminListPageButton>
        <span aria-live="polite">
          {currentPage} / {totalPages}
        </span>
        <S.AdminListPageButton
        type="button"
        aria-label="다음 페이지"
        disabled={isLoading || currentPage === totalPages}
        onClick={() => setPage(currentPage + 1)}>
          <FiChevronRight aria-hidden="true"/>
        </S.AdminListPageButton>
      </S.AdminListPagination>
    </S.AdminListPanel>
  );
};
