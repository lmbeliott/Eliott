#include <iostream>
#include <string>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    int n = a.size();
    int k = 0;
    while (k < n && a.substr(k) + a.substr(0, k) != b) {   // le mot tourné de k crans
        k = k + 1;                                         // on s'arrête au plus petit k qui convient
    }
    if (k < n) {
        cout << k << "\n";
    } else {
        cout << -1 << "\n";
    }
    return 0;
}
