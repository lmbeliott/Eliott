#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<pair<int, int>> sommets(n);
    for (auto& s : sommets) cin >> s.first >> s.second;

    // Altitude croissante, et difficulté décroissante à altitude égale :
    // deux sommets de même altitude ne pourront jamais se suivre.
    sort(sommets.begin(), sommets.end(), [](const pair<int, int>& x, const pair<int, int>& y) {
        if (x.first != y.first) return x.first < y.first;
        return x.second > y.second;
    });

    // fin[k] = plus petite difficulté finale d'une sous-suite strictement croissante de longueur k + 1.
    vector<int> fin;
    for (const auto& s : sommets) {
        int d = s.second;
        auto it = lower_bound(fin.begin(), fin.end(), d);  // premier élément >= d
        if (it == fin.end()) fin.push_back(d);
        else *it = d;
    }

    cout << fin.size() << "\n";
    return 0;
}
