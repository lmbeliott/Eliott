#include <iostream>
#include <utility>
using namespace std;

// renvoie (a^n mod m, (1 + a + ... + a^(n-1)) mod m), soit la somme des n premiers termes
pair<long long, long long> puissance_et_somme(long long a, long long n, long long m) {
    if (n == 0) return {1 % m, 0};
    if (n % 2 == 0) {
        // les n termes = les n/2 premiers, puis les mêmes multipliés par a^(n/2)
        auto [p, s] = puissance_et_somme(a, n / 2, m);
        return {p * p % m, s * (1 + p) % m};
    }
    // n impair : les n - 1 premiers termes, plus le terme a^(n-1)
    auto [p, s] = puissance_et_somme(a, n - 1, m);
    return {p * a % m, (s + p) % m};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, n, m;
        cin >> a >> n >> m;
        // 1 + A + ... + A^N contient N + 1 termes
        cout << puissance_et_somme(a % m, n + 1, m).second << "\n";
    }
    return 0;
}
