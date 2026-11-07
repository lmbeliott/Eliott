#include <iostream>
#include <map>
using namespace std;

map<long long, long long> memo;

// pire nombre de comparaisons du tri fusion sur n éléments
long long comparaisons(long long n) {
    if (n == 1) {
        return 0;
    }
    if (memo.count(n)) {
        return memo[n];
    }
    long long r = comparaisons(n / 2) + comparaisons((n + 1) / 2) + n - 1;
    memo[n] = r;
    return r;
}

int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long n;
        cin >> n;
        cout << comparaisons(n) << "\n";
    }
    return 0;
}
