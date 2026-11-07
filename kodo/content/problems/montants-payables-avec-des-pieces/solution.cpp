#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int k;
    long long x;
    cin >> k >> x;
    vector<long long> pieces(k);
    for (auto& a : pieces) cin >> a;
    long long m = *min_element(pieces.begin(), pieces.end());

    // dist[r] : plus petit montant payable de reste r modulo m (sommets : les restes)
    const long long INFINI = (long long)4e18;
    vector<long long> dist(m, INFINI);
    dist[0] = 0;
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    tas.push({0, 0});
    while (!tas.empty()) {
        auto [d, r] = tas.top();
        tas.pop();
        if (d > dist[r]) continue;
        for (long long a : pieces) {
            int v = (r + a) % m;
            if (d + a < dist[v]) {
                dist[v] = d + a;
                tas.push({dist[v], v});
            }
        }
    }

    // les montants payables de reste r sont dist[r], dist[r] + m, dist[r] + 2m, ...
    long long total = 0;
    for (int r = 0; r < m; r++) {
        if (dist[r] <= x) total += (x - dist[r]) / m + 1;
    }
    cout << total - 1 << "\n";  // on retire le montant 0
    return 0;
}
