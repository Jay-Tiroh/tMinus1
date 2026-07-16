import {
  DepositAddress,
  DepositAddressesResponse,
  GetTransactionsQueryParams,
  InternalTransferRequest,
  InternalTransferResponse,
  PortfolioChartPoint,
  PortfolioHistoryMeta,
  PortfolioHistoryResponse,
  PortfolioRange,
  SimulateDepositRequest,
  SimulateDepositResponse,
  SingleDepositAddressResponse,
  Transaction,
  TransactionDetailResponse,
  TransactionsMeta,
  TransactionsResponse,
  WalletResponse,
  Withdrawal,
  WithdrawalRequest,
  WithdrawalResponse,
} from "@/features/wallets/types/wallets";
import { baseApi } from "../../../store/services/baseApi";

const walletsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /wallet
    getWallet: builder.query<WalletResponse["data"], void>({
      query: () => "/wallet",
      transformResponse: (response: WalletResponse) => response.data,
      providesTags: ["Wallet"],
    }),

    // GET /wallet/portfolio/history
    getPortfolioHistory: builder.query<
      { data: PortfolioChartPoint[]; meta: PortfolioHistoryMeta },
      { range: PortfolioRange }
    >({
      query: ({ range }) => ({
        url: "/wallet/portfolio/history",
        params: { range },
      }),
      transformResponse: (response: PortfolioHistoryResponse) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Portfolio"],
    }),

    // GET /wallet/deposit-addresses
    getDepositAddresses: builder.query<DepositAddress[], void>({
      query: () => "/wallet/deposit-addresses",
      transformResponse: (response: DepositAddressesResponse) => response.data,
      providesTags: ["Wallet"],
    }),

    // GET /wallet/deposit-addresses/{symbol}
    getDepositAddressBySymbol: builder.query<DepositAddress, string>({
      query: (symbol) => `/wallet/deposit-addresses/${symbol}`,
      transformResponse: (response: SingleDepositAddressResponse) =>
        response.data,
      providesTags: ["Wallet"],
    }),

    // GET /wallet/transactions
    getTransactions: builder.query<
      { data: Transaction[]; meta: TransactionsMeta },
      GetTransactionsQueryParams | void
    >({
      query: (params) => ({
        url: "/wallet/transactions",
        params: params || undefined,
      }),
      transformResponse: (response: TransactionsResponse) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Transaction"],
    }),

    // GET /wallet/transactions/{transactionId}
    getTransactionById: builder.query<Transaction, string>({
      query: (transactionId) => `/wallet/transactions/${transactionId}`,
      transformResponse: (response: TransactionDetailResponse) => response.data,
      providesTags: ["Transaction"],
    }),

    // POST /wallet/deposit/simulate
    simulateDeposit: builder.mutation<
      SimulateDepositResponse["data"],
      SimulateDepositRequest
    >({
      query: (depositData) => ({
        url: "/wallet/deposit/simulate",
        method: "POST",
        body: depositData,
      }),
      transformResponse: (response: SimulateDepositResponse) => response.data,
      invalidatesTags: ["Wallet", "Transaction", "Portfolio"],
    }),

    // POST /wallet/withdrawals
    requestWithdrawal: builder.mutation<Withdrawal, WithdrawalRequest>({
      query: (withdrawalData) => ({
        url: "/wallet/withdrawals",
        method: "POST",
        body: withdrawalData,
      }),
      transformResponse: (response: WithdrawalResponse) => response.data,
      invalidatesTags: ["Wallet", "Transaction", "Portfolio"],
    }),

    // POST /wallet/transfers
    internalTransfer: builder.mutation<
      InternalTransferResponse["data"],
      InternalTransferRequest
    >({
      query: (transferData) => ({
        url: "/wallet/transfers",
        method: "POST",
        body: transferData,
      }),
      transformResponse: (response: InternalTransferResponse) => response.data,
      invalidatesTags: ["Wallet", "Transaction", "Portfolio"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetWalletQuery,
  useGetPortfolioHistoryQuery,
  useGetDepositAddressesQuery,
  useGetDepositAddressBySymbolQuery,
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useSimulateDepositMutation,
  useRequestWithdrawalMutation,
  useInternalTransferMutation,
} = walletsApi;
