#include <iostream>
#include <map>
using namespace std;

map<long long, long long> memo;   // memo[n] = meilleure valeur à partir d'un jeton n

long long v(long long n) {
    if (n == 0) {
        return 0;
    }
    if (memo.count(n)) {
        return memo[n];
    }
    long long r = max(n, v(n / 2) + v(n / 3) + v(n / 5));
    memo[n] = r;
    return r;
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n;
        cin >> n;
        cout << v(n) << "\n";
    }
    return 0;
}
