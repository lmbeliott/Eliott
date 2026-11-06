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
    vector<pair<int, int>> points(n);
    for (auto& p : points) cin >> p.first >> p.second;

    // X croissant, et Y décroissant à X égal :
    // deux points de même X ne pourront jamais se suivre.
    sort(points.begin(), points.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
        if (a.first != b.first) return a.first < b.first;
        return a.second > b.second;
    });

    // fin[k] = plus petit Y final d'une sous-suite strictement croissante de longueur k + 1.
    vector<int> fin;
    for (const auto& p : points) {
        int y = p.second;
        auto it = lower_bound(fin.begin(), fin.end(), y);  // premier élément >= y
        if (it == fin.end()) fin.push_back(y);
        else *it = y;
    }

    cout << fin.size() << "\n";
    return 0;
}
