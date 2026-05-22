import {
  DepositAddressesResponse,
  GetTransactionsQueryParams,
  PortfolioHistoryResponse,
  PortfolioRange,
  SimulateDepositRequest,
  SimulateDepositResponse,
  SingleDepositAddressResponse,
  TransactionDetailResponse,
  TransactionsResponse,
  WalletResponse,
  WithdrawalRequest,
  WithdrawalResponse,
} from "@/types/wallets";
import { baseApi } from "./baseApi";

const walletsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /wallet
    getWallet: builder.query<WalletResponse, void>({
      query: () => "/wallet",
      providesTags: ["Wallet"],
    }),

    // GET /wallet/portfolio/history
    getPortfolioHistory: builder.query<
      PortfolioHistoryResponse,
      { range: PortfolioRange }
    >({
      query: ({ range }) => ({
        url: "/wallet/portfolio/history",
        params: { range },
      }),
      providesTags: ["Portfolio"],
    }),

    // GET /wallet/deposit-addresses
    getDepositAddresses: builder.query<DepositAddressesResponse, void>({
      query: () => "/wallet/deposit-addresses",
      providesTags: ["Wallet"],
    }),

    // GET /wallet/deposit-addresses/{symbol}
    getDepositAddressBySymbol: builder.query<
      SingleDepositAddressResponse,
      string
    >({
      query: (symbol) => `/wallet/deposit-addresses/${symbol}`,
      providesTags: ["Wallet"],
    }),

    // GET /wallet/transactions
    getTransactions: builder.query<
      TransactionsResponse,
      GetTransactionsQueryParams | void
    >({
      query: (params) => ({
        url: "/wallet/transactions",
        params: params || undefined,
      }),
      providesTags: ["Transaction"],
    }),

    // GET /wallet/transactions/{transactionId}
    getTransactionById: builder.query<TransactionDetailResponse, string>({
      query: (transactionId) => `/wallet/transactions/${transactionId}`,
      providesTags: ["Transaction"],
    }),

    // POST /wallet/deposit/simulate
    simulateDeposit: builder.mutation<
      SimulateDepositResponse,
      SimulateDepositRequest
    >({
      query: (depositData) => ({
        url: "/wallet/deposit/simulate",
        method: "POST",
        body: depositData,
      }),
      // Invalidating Wallet and Transaction tags since a deposit affects balances and transaction history
      invalidatesTags: ["Wallet", "Transaction", "Portfolio"],
    }),

    // POST /wallet/withdrawals
    requestWithdrawal: builder.mutation<WithdrawalResponse, WithdrawalRequest>({
      query: (withdrawalData) => ({
        url: "/wallet/withdrawals",
        method: "POST",
        body: withdrawalData,
      }),
      // Invalidating Wallet and Transaction tags since a withdrawal affects balances and transaction history
      invalidatesTags: ["Wallet", "Transaction", "Portfolio"],
    }),
  }),
  overrideExisting: false,
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
} = walletsApi;
