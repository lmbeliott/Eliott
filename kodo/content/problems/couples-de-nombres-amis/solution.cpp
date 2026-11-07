#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;

    // s[m] = somme des diviseurs de m strictement plus petits que m
    vector<long long> s(n + 1, 0);
    for (int d = 1; d <= n / 2; d++) {
        for (int m = 2 * d; m <= n; m += d) {   // d divise 2d, 3d, 4d...
            s[m] += d;
        }
    }

    vector<int> a_list, b_list;
    for (int a = 2; a <= n; a++) {
        long long b = s[a];
        if (a < b && b <= n && s[b] == a) {
            a_list.push_back(a);
            b_list.push_back(b);
        }
    }

    cout << a_list.size() << "\n";
    for (int i = 0; i < (int)a_list.size(); i++) {
        cout << a_list[i] << " " << b_list[i] << "\n";
    }
    return 0;
}
