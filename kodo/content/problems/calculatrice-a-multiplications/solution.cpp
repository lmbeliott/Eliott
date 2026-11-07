#include <functional>
#include <iostream>
#include <map>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

long long coutMinimal(long long n, long long d, const vector<pair<long long, long long>>& touches) {
    // Dijkstra en partant de N : le sommet v signifie « il reste à fabriquer v ».
    map<long long, long long> dist;
    priority_queue<pair<long long, long long>, vector<pair<long long, long long>>, greater<pair<long long, long long>>> tas;
    dist[n] = 0;
    tas.push({0, n});
    while (!tas.empty()) {
        auto [c, v] = tas.top();
        tas.pop();
        if (c > dist[v]) continue;
        if (v == 0) return c;
        vector<pair<long long, long long>> candidats = {{0, v * d}};  // fabriquer v uniquement avec des « + 1 »
        for (auto [m, cm] : touches) {
            long long q = v / m;
            // dernière multiplication appliquée à q (on complète par des « + 1 ») ou à q + 1 (des « − 1 »)
            candidats.push_back({q, cm + d * (v - m * q)});
            if (v % m != 0 && q + 1 < v) candidats.push_back({q + 1, cm + d * (m * (q + 1) - v)});
        }
        for (auto [u, l] : candidats) {
            auto it = dist.find(u);
            if (it == dist.end() || c + l < it->second) {
                dist[u] = c + l;
                tas.push({c + l, u});
            }
        }
    }
    return -1;
}

int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, d;
        int k;
        cin >> n >> d >> k;
        vector<pair<long long, long long>> touches(k);
        for (auto& [m, c] : touches) cin >> m >> c;
        cout << coutMinimal(n, d, touches) << "\n";
    }
    return 0;
}
